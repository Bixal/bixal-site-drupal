const uswds = require("@uswds/compile");
const { parallel, watch, series, src, dest } = require("gulp");
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const uglifyes = require("uglify-es");
const composer = require("gulp-uglify/composer");
const uglify = composer(uglifyes, console);
// These are required to build Sass here.
const csso = require("postcss-csso");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const sass = require("gulp-sass")(require("sass-embedded"));
const log = console.log;
const colors = {
  red: "\x1b[31m%s\x1b[0m",
  blue: "\x1b[34m%s\x1b[0m",
  yellow: "\x1b[33m%s\x1b[0m",
};
// End required to build Sass.

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
  return src(settings.js.src).pipe(uglify()).pipe(gulp.dest(settings.js.dest));
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

// These are required to build Sass here.
let getSrcFrom = (key) => {
  if (uswds.paths.src[key]) {
    return uswds.paths.src[key];
  }
  return uswds.paths.src.defaults[`v${uswds.settings.version}`][key];
};

function handleError(error) {
  log(error.message);
  return this.emit("end");
}

function logVersion() {
  log(colors.blue, `uswds.version: ${uswds.settings.version}`);
  return Promise.resolve("logged version");
}

function buildSass() {
  let uswdsPath = "uswds";
  if (uswds.settings.version === 3) {
    uswdsPath = "@uswds/uswds";
  }

  const pkg = require(`./node_modules/${uswdsPath}/package.json`).version;

  log(colors.blue, `Compiling with USWDS ${pkg}`);
  const buildSettings = {
    plugins: [
      autoprefixer({
        cascade: false,
        grid: true,
        overrideBrowserslist: uswds.settings.compile.browserslist,
      }),
      csso({ forceMediaMerge: false }),
    ],
    includes: [
      // 1. local theme files
      uswds.paths.dist.theme,
      // 2. uswds organization directory (npm packages)
      getSrcFrom("uswds"),
      // 3. v2 packages directory
      `${getSrcFrom("sass")}/packages`.replaceAll("//", "/"),
      // 4. local uswds package
      getSrcFrom("sass"),
    ],
  };

  return src([`${uswds.paths.dist.theme}/*.scss`.replaceAll("//", "/")])
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.init({ largeFile: true }))
    .pipe(
      sass({ includePaths: buildSettings.includes }).on("error", handleError),
    )
    .pipe(replace(/\buswds @version\b/g, `based on uswds v${pkg}`))
    .pipe(postcss(buildSettings.plugins))
    .pipe(sourcemaps.write("."))
    .pipe(dest(uswds.paths.dist.css));
}

function watchSass() {
  return watch(
    [
      `${uswds.paths.dist.theme}/**/*.scss`.replaceAll("//", "/"),
      `${uswds.paths.src.projectSass}/**/*.scss`.replaceAll("//", "/"),
    ],
    buildSass,
  );
}
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
  buildSass,
  watchSass,
  browserSync,
  watchJSTwigFiles,
);
exports.update = uswds.updateUswds;
exports.copyAssets = uswds.copyAssets;
exports.compileSass = series(logVersion, buildSass);
exports.compile = series(
  logVersion,
  parallel(buildSass, uswds.compileIcons, buildJS, uswds.copyAssets),
);
exports.default = this.compile;
