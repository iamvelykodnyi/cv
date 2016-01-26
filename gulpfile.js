var
  gulp          = require('gulp'),
  jade          = require('gulp-jade'),
  sourcemaps    = require('gulp-sourcemaps'),
  autoprefixer  = require('gulp-autoprefixer'),
  plumber       = require('gulp-plumber'),
  nib           = require('nib'),
  jeet          = require('jeet'),
  rupture       = require('rupture'),
  stylus        = require('gulp-stylus'),
  browserSync   = require('browser-sync').create(),
  reload        = browserSync.reload;

  // =============================================================================
  // Task: html
  // =============================================================================
    gulp.task('html', function() {
      gulp.src('src/**/*.jade')
        .pipe(plumber())
        .pipe(jade())
        .pipe(gulp.dest('app'));
    });

// =============================================================================
// Task: styles
// =============================================================================
  gulp.task('styles', function() {
    gulp.src('src/styles/*.styl')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(stylus({ use: [nib(), jeet(), rupture()] }))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(sourcemaps.write('/'))
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.stream());
  });

// =============================================================================
// Task: serve
// =============================================================================
  gulp.task('serve', ['styles', 'html'], function() {
      browserSync.init({
          server: "./app"
      });
      gulp.watch("src/styles/**/*.styl", ['styles']);
      gulp.watch("src/**/*.jade", ['html']);
      gulp.watch("app/**/*.html").on('change', browserSync.reload);
  })

// =============================================================================
// Task: default
// =============================================================================
  gulp.task('default', ['styles']);
