const atImport      = require('postcss-import');
const autoprefixer  = require('autoprefixer');
const browserSync   = require('browser-sync').create();
const concat        = require('gulp-concat-util');
const cssnano       = require('gulp-cssnano');
const del           = require('del');
const gulp          = require('gulp');
const gulpIf        = require('gulp-if');
const imagemin      = require('gulp-imagemin');
const jade          = require('gulp-jade');
const plumber       = require('gulp-plumber');
const postcss       = require('gulp-postcss');
const sass          = require('gulp-sass');
const sourcemaps    = require('gulp-sourcemaps');
const uglify        = require('gulp-uglify');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

// Paths to the source code.
const sourcePath = {
  html:       'source/*.jade',
  icons:      'source/icons/*.css',
  images:     'source/images/**/*.{png,jpg,svg}',
  scripts:    'source/scripts/**/*.js',
  styles:     'source/styles/**/*.scss'
};

// Path to the application
const buildPath = isDev ? 'app' : 'build';
const autoprefixerOption = {
  browsers: ['last 10 versions']
};

// Task: html
gulp.task('html', () => {
  gulp.src(sourcePath.html)
    .pipe(plumber())
    .pipe(jade({
      pretty: isDev ? true : false
    }))
    .pipe(gulp.dest(buildPath));
});

// Task: scripts.
gulp.task('scripts', () => {
  gulp.src(sourcePath.scripts)
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(gulpIf(!isDev, uglify()))
    .pipe(gulp.dest(buildPath + '/scripts'));
});

// Task: styles.
gulp.task('styles', () => {
  gulp.src(sourcePath.styles)
    .pipe(plumber())
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass({outputStyle: isDev ? 'expanded' : 'compressed'}))
    .pipe(postcss([
      atImport(),
      autoprefixer(autoprefixerOption)
    ]))
    .pipe(gulpIf(!isDev, cssnano()))
    .pipe(gulpIf(isDev, sourcemaps.write()))
    .pipe(gulp.dest(buildPath + '/styles'))
    .pipe(browserSync.stream());
});

// Task: Images.
gulp.task('images', () => {
  const imageminOption = {
    progressive: true,
    interlaced: true,
    svgoPlugins: [
      {removeUnknownsAndDefaults: false},
      {cleanupIDs: false},
      {convertStyleToAttrs: true}
    ]
  };
  gulp.src(sourcePath.images)
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest(buildPath + '/images'))
    .pipe(browserSync.stream());
});

// Task: Clean
gulp.task('clean', () => del(buildPath));

// Task: watch
gulp.task('watch', ['default', 'server'], function() {
  gulp.watch(sourcePath.styles, ['styles']);
  gulp.watch(sourcePath.images, ['images']);
  gulp.watch(sourcePath.scripts, ['scripts']).on('change', browserSync.reload);
  gulp.watch(sourcePath.html, ['html']);
  gulp.watch('app/**/*.html').on('change', browserSync.reload);
});

// Task: server
gulp.task('server', () => browserSync.init({server: "./" + buildPath}));

// Task: default
gulp.task('default', ['html', 'styles', 'scripts', 'images']);
