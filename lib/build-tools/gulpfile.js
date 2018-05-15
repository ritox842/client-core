const palette = require('./../src/palette');
const gulp = require('gulp');
const replace = require('gulp-replace');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const chalk = require('chalk');
const path = require('path');
const runSequence = require('run-sequence');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sass = require('@datorama/postcss-node-sass');
const {
  initThemify,
  themify
} = require('@datorama/themify');
const rename = require("gulp-rename");
const watch = require('gulp-watch');
const buildScssTask = require('./build-scss-task');
const inlineResources = require('./inline-resources').inlineResourcesForDirectory;
const bundleSrc = require('./src-bundler').bundlePrimarySrc;
const compileSrc = require('./src-compiler').compile;
const composeRelease = require('./release-composer').composeRelease;
const rootDir = path.join(__dirname, '../..');
const libDir = path.join(rootDir, 'lib');
const buildDir = path.join(rootDir, 'build');
const tsconfigName = 'tsconfig.json';
const distDir = path.join(rootDir, 'dist');
const bundlesDir = path.join(distDir, 'bundles');
const packagesDir = path.join(distDir, 'packages');
const packageName = 'datorama';
const releaseDirName = '_$releases';
const releaseDir = path.join(distDir, releaseDirName, packageName);
const outputDir = path.join(packagesDir, packageName);
const srcFolder = 'src';

const stylesGlob = [
  `!${path.join(buildDir + '/**/*.themes.scss')}`,
  `!${path.join(buildDir + '/**/*.theme.scss')}`,
  path.join(buildDir, '**/*.+(scss|css)')
];
const htmlGlob = path.join(buildDir, '**/*.html');

const htmlMinifierOptions = {
  collapseWhitespace: true,
  removeComments: true,
  caseSensitive: true,
  removeAttributeQuotes: false
};

gulp.task('default', ['build']);

gulp.task('build', function (cb) {
  runSequence(
    'clean',
    'copy',
    'lib:assets',
    'ngc',
    'rollup',
    'release',
    'polish',
    'themify:prod',
    'copy-palette',
    function (err) {
      if (err) {
        chalk.red(`ERROR: ${err.message}`);
      } else {
        chalk.green('Build finished succesfully');
      }
    }
  );
});

gulp.task('clean', function () {
  return del([`${buildDir}/**/*`, `${distDir}/**/*`], {
    force: true
  });
});

gulp.task('copy', ['copy:package-version']);

gulp.task('copy:src', ['clean'], function () {
  return gulp
    .src([path.join(libDir, '/**/*'),
      `!${path.join(libDir + '/node_modules/*')}`,
      `!${path.join(libDir + '/**/*.themes.scss')}`,
      `!${path.join(libDir + '/**/*.theme.scss')}`,
      `!${path.join(libDir + '/build-tools')}`,
      `!${path.join(libDir + '/build-tools/**')}`
    ], {
      base: libDir
    })
    .pipe(gulp.dest(buildDir));
});

gulp.task('copy:package-version', ['copy:src'], function () {
  const LIB_VERSION = require('../package.json').version;

  //update version on package.json on build folder
  return gulp
    .src(`${buildDir}/package.json`)
    .pipe(
      replace(
        /["']version["']\s*:\s*["'].*["']/g,
        `"version": "${LIB_VERSION}"`
      )
    )
    .pipe(gulp.dest(buildDir));
});

gulp.task('ngc', function () {
  return compileSrc(srcFolder, {
    libDir: buildDir,
    tsconfigName: tsconfigName,
    outputDir: outputDir
  });
});

gulp.task('rollup', function () {
  return bundleSrc({
    outputDir: outputDir,
    bundlesDir: bundlesDir,
    packageName: packageName
  });
});

gulp.task('release', function () {
  return composeRelease({
    src: srcFolder,
    distDir: distDir,
    packageName: packageName,
    bundlesDir: bundlesDir,
    sourceDir: buildDir,
    releaseDir: releaseDir,
    releaseDirName: releaseDirName
  });
});

gulp.task('lib:assets', function () {
  return new Promise(resolve => {
    runSequence(
      'lib:assets:scss:octal-literal-fix',
      'lib:assets:scss',
      'lib:assets:copy-styles',
      'lib:assets:html',
      'lib:assets:inline',
      function (err) {
        if (err) {
          chalk.red(`ERROR: ${err.message}`);
        } else {
          chalk.green("Assets finished succesfully");
          resolve();
        }
      }
    );
  });
});

/**
 * Fix issue with octal literals on scss files before rollup
 * @link https://stackoverflow.com/questions/36878850/octal-literals-are-not-allowed-in-strict-mode
 * @example
 *
 * replaces any of these cases:
 *
 * content: "\1324";
 * content: '\1234';
 * content:"\1234";
 * content:'\1234';
 *
 * with:
 *
 * content:"\\1234";
 */
gulp.task('lib:assets:scss:octal-literal-fix', function () {
  return gulp
    .src([`${buildDir}/**/*.scss`])
    .pipe(replace(/content:\s*["'](\\[\w]+)["']\s*;/g, 'content:"\\$1";'))
    .pipe(gulp.dest(buildDir));
});

gulp.task('lib:assets:scss', () => {
  return buildScssTask(buildDir, buildDir, true);
});

gulp.task('lib:assets:copy-styles', () => {
  return gulp.src(stylesGlob).pipe(gulp.dest(outputDir));
});

gulp.task('lib:assets:html', () => {
  return gulp
    .src(htmlGlob)
    .pipe(htmlmin(htmlMinifierOptions))
    .pipe(gulp.dest(outputDir));
});

gulp.task('lib:assets:inline', () => {
  return inlineResources(buildDir);
});

gulp.task('polish', () => {
  return new Promise(resolve => {
    runSequence(
      'polish:clean:dirs',
      'polish:move:release',
      'polish:clean:release',
      function (err) {
        if (err) {
          chalk.red(`ERROR: ${err.message}`);
        } else {
          resolve();
        }
      }
    )
  });
});

gulp.task('polish:clean:dirs', () => {
  return del([
    buildDir,
    bundlesDir,
    packagesDir
  ], {
    force: true
  });
});

gulp.task('polish:move:release', () => {
  return gulp.src(`${releaseDir}/**/*`).pipe(gulp.dest(distDir));
});

gulp.task('polish:clean:release', () => {
  return del([path.join(distDir, releaseDirName)], {
    force: true
  });
});

gulp.task('default', ['build']);


/**
 * Deletes the specified folder
 */
function deleteFolders(folders) {
  return del(folders, {
    force: true
  });
}

/**
 * replaces slashes by back slashes
 * @param filePath
 */
function replaceSlashes(filePath) {
  return filePath.replace(/\\/g, '/');
}


/**
 *
 *  THEMES TASKS
 *
 */

const THEMES_INDEX_SRC = '../src/scss/themes/';
const THEMES_INDEX = `${THEMES_INDEX_SRC}index.themes.scss`;

const themifyOptions = {
  palette: palette
};

gulp.task('themify', () => {
  return gulp.src(THEMES_INDEX)
    .pipe(postcss([
      initThemify(themifyOptions),
      sass()
    ]))
    .pipe(rename("bundle.scss"))
    .pipe(gulp.dest(distDir));
});

gulp.task('themify:prod', function () {
  runSequence('replace-for-prod', 'themify');
});

gulp.task('themify:dev', function () {
  runSequence('replace-for-dev', 'watch:themes');
});

gulp.task('watch:themes', function () {
  const glob = [
    '../src/**/*.themes.scss',
    '../src/**/*.theme.scss'
  ]

  return watch(glob, {
    ignoreInitial: false
  }, function () {
    console.log('Build themes ', Math.random());
    gulp.src(THEMES_INDEX)
      .pipe(postcss([
        initThemify(themifyOptions),
        sass(),
        autoprefixer(),
        themify(themifyOptions)
      ]))
      .pipe(rename("bundle.css"))
      .pipe(gulp.dest('../../tmp'));
  });
});


gulp.task('replace-for-dev', function () {
  return gulp.src(THEMES_INDEX)
    .pipe(replace(true, false))
    .pipe(gulp.dest(THEMES_INDEX_SRC));
});

gulp.task('replace-for-prod', function () {
  return gulp.src(THEMES_INDEX)
    .pipe(replace(false, true))
    .pipe(gulp.dest(THEMES_INDEX_SRC));
});

gulp.task('copy-palette', function () {
  return gulp.src(['../src/palette.js', '../src/themes-utils.js'])
    .pipe(gulp.dest(distDir));
});