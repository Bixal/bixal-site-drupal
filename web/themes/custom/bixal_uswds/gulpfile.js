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
    minDest: "./dist/js/min",
    minSrc: "./src/js/**/*.js",
    src: "./src/js/**/*.js",
  },
};

// JS build function.
function buildJS() {
  return src(settings.js.src).pipe(uglify()).pipe(dest(settings.js.dest));
}

// Watch changes on JS and twig files and trigger functions at the end.
function watchJSTwigFiles() {
  watch(
    ["./src/js/**/*.js", "./templates/**/*.html.twig"],
    {
      events: "all",
      ignoreInitial: false,
    },
    series(buildJS, browserSyncReload),
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
  parallel(exports.compileSass, uswds.compileIcons, buildJS),
);
exports.default = this.compile;
