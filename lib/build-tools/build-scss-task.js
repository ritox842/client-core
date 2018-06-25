const gulp         = require('gulp'),
      autoprefixer = require('gulp-autoprefixer'),
      path         = require('path');

// These imports lack of type definitions.
const sass = require('gulp-sass');
const gulpIf = require('gulp-if');
const gulpCleanCss = require('gulp-clean-css');

/** Create a gulp task that builds SCSS files. */
async function buildScssTask( outputDir, sourceDir, minifyOutput = false ) {
  return gulp.src([
    `!${path.join(sourceDir + '**/*.themes.scss')}`,
    `!${path.join(sourceDir + '**/*.theme.scss')}`,
    path.join(sourceDir, '**/*.scss'),
  ])
             .pipe(sass().on('error', sass.logError))
             .pipe(autoprefixer({
               browsers: ['last 2 versions'],
               cascade : false
             }))
             .pipe(gulpIf(minifyOutput, gulpCleanCss()))
             .pipe(gulp.dest(outputDir));
}

module.exports = buildScssTask;
