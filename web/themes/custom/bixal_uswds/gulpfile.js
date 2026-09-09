const path = require("path");
const fs = require("fs");
const uswds = require("@uswds/compile");
const { parallel, watch, series, src, dest } = require("gulp");
const { deleteAsync } = require("del");
const browsersync = require("browser-sync").create();
const uglifyes = require("uglify-es");
const composer = require("gulp-uglify/composer");
const uglify = composer(uglifyes, console);
const log = console.log;
const colors = {
  red: "\x1b[31m%s\x1b[0m",
  blue: "\x1b[34m%s\x1b[0m",
  yellow: "\x1b[33m%s\x1b[0m",
};
// End required to build Sass.

// With the monorepo, @uswds/uswds is hoisted to root `node_modules`, but
// uswds-compile assumes it's local to this theme. We're redirecting to the new path now.
const uswdsPackage = require.resolve.paths("@uswds/uswds");
const resolvedUswdsDir = uswdsPackage.find((dir) =>
  fs.existsSync(path.join(dir, "@uswds/uswds")),
);
const uswdsScope = path.join(resolvedUswdsDir, "@uswds");
const uswdsRoot = path.join(uswdsScope, "uswds");
const uswdsDist = path.join(uswdsRoot, "dist");

// The component library is a workspace package, so this theme compiles the same
// Sass and JS sources Storybook does. Nothing is copied into the theme except
// the Twig templates and image assets, which Drupal has to read at runtime.
const designSystemDir = path.dirname(
  require.resolve("@bixal/design-system/package.json"),
);

/**
 * USWDS version
 */
// Use version 3.
uswds.settings.version = 3;

/**
 * Custom path settings
 * Set as many as you need
 * see https://designsystem.digital.gov/documentation/getting-started/developers/phase-two-compile/#step-4-create-path-settings-and-export-compile-functions
 */

// Source paths updated after converting to monorepo.
// `uswds` is the @uswds org directory; the Sass sources live in `packages/` at
// the root of the @uswds/uswds package, not under `dist/`.
// uswds-compile builds its Sass include list internally and offers no way to
// extend it. `paths.src.uswds` is only ever read to populate that list (see
// `@uswds/compile/gulpfile.js`), and nothing here imports through the `@uswds`
// scope directory, so we spend that slot on the design system. That's what lets
// `styles.scss` resolve `uswds-paths`, `uswds-settings` and `design-system`.
uswds.paths.src.uswds = designSystemDir;
uswds.paths.src.sass = path.join(uswdsRoot, "packages");
uswds.paths.src.fonts = `${uswdsDist}/fonts`;
uswds.paths.src.img = `${uswdsDist}/img`;
uswds.paths.src.js = `${uswdsDist}/js`;
uswds.paths.src.theme = `${uswdsDist}/theme`;

uswds.paths.dist.theme = "./src/sass";
uswds.paths.dist.css = "./dist/css";
uswds.paths.dist.img = "./dist/assets/img";
uswds.paths.dist.fonts = "./dist/assets/fonts";
uswds.paths.dist.js = "./dist/js";
uswds.paths.src.projectSass = "./src/sass";

const settings = {
  sass: {
    src: ["./src/sass/**/*.scss"],
  },
  js: {
    dest: "./dist/js",
    designSystemDest: "./dist/js/design-system",
    minDest: "./dist/js/min",
    minSrc: "./src/js/**/*.js",
    src: "./src/js/**/*.js",
  },
};

// JS build function.
function buildJS() {
  return src(settings.js.src).pipe(uglify()).pipe(dest(settings.js.dest));
}

// The design system's JS, minified into the theme's dist. Story files are
// Storybook-only, so they never ship. `base` keeps the package's directory
// structure, which `bixal_uswds.libraries.yml` points at.
function buildDesignSystemJS() {
  return src(
    [`${designSystemDir}/**/*.js`, `!${designSystemDir}/**/*.stories.js`],
    { base: designSystemDir },
  )
    .pipe(uglify())
    .pipe(dest(settings.js.designSystemDest));
}

// Watch changes on JS and twig files and trigger functions at the end.
function watchJSTwigFiles() {
  watch(
    [
      "./src/js/**/*.js",
      "./templates/**/*.html.twig",
      `${designSystemDir}/**/*.js`,
      `${designSystemDir}/**/*.twig`,
    ],
    {
      events: "all",
      ignoreInitial: false,
    },
    series(parallel(buildJS, buildDesignSystemJS), browserSyncReload),
  );
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Compile CSS from scss.
function buildCompStyles() {
  return src(settings.sass.src).pipe(
    browsersync.reload({
      stream: true,
    }),
  );
}

// Watch changes on sass files and trigger functions at the end.
function watchCompFiles() {
  watch(
    ["./src/sass/**/*.scss"],
    {
      events: "all",
      ignoreInitial: false,
    },
    series(buildCompStyles),
  );
}

// Init BrowserSync.
function browserSync(done) {
  browsersync.init({
    injectChanges: true,
    logPrefix: "BixalTheme (USWDS)",
    baseDir: "./",
    open: false,
    notify: true,
    proxy: "bixalcom.lndo.site",
    host: "bixalcom.lndo.site",
    openBrowserAtStart: false,
    reloadOnRestart: true,
    port: 32677,
    ui: false,
  });
  done();
}

function logVersion() {
  log(colors.blue, `uswds.version: ${uswds.settings.version}`);
  return Promise.resolve("logged version");
}

function watchSass() {
  return watch(
    [
      `${uswds.paths.dist.theme}/**/*.scss`.replaceAll("//", "/"),
      `${uswds.paths.src.projectSass}/**/*.scss`.replaceAll("//", "/"),
      `${designSystemDir}/**/*.scss`,
    ],
    uswds.compileSass,
  );
}
// End required to build Sass.

// Remove the compiled assets. This will help show errors early if the build
// process is broken and the site is simply using the old files.
function clean() {
  log(colors.blue, "Clearing out the dist folder");
  return deleteAsync("dist/**");
}

/**
 * Exports
 * Add as many as you need
 */

// Init project
// init commented out as it is only used once at the very beginning of the project.
// exports.init = uswds.init;

// Various compile functions.
exports.watch = parallel(
  watchCompFiles,
  logVersion,
  uswds.compileSass,
  watchSass,
  browserSync,
  watchJSTwigFiles,
);
exports.update = uswds.updateUswds;
exports.copyAssets = uswds.copyAssets;
exports.compileSass = uswds.compileSass;
exports.compile = series(
  logVersion,
  clean,
  uswds.copyAssets, // Assets need to be moved before compiling and moving icons.
  parallel(
    exports.compileSass,
    uswds.compileIcons,
    buildJS,
    buildDesignSystemJS,
  ),
);
exports.default = this.compile;
