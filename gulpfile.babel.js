'use strict';

import atImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import concat from 'gulp-concat-util';
import cssnano  from 'gulp-cssnano';
import del from 'del';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import imagemin from 'gulp-imagemin';
import jade from 'gulp-jade';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

// Paths to the source code.
const sourcePath = 'source';
const sourcePaths = {
  html:     `${sourcePath}/*.jade`,
  icons:    `${sourcePath}/icons/*.css`,
  images:   `${sourcePath}/images/**/*.{png,jpg,svg}`,
  scripts:  `${sourcePath}/scripts/**/*.js`,
  styles:   `${sourcePath}/styles/**/*.scss`
};

// Path to the application
const buildPath = isDev ? 'app' : 'build';

// Options of plugins
const autoprefixerOption = {
  browsers: ['last 10 versions']
};
const imageminOption = {
  progressive: true,
  interlaced: true,
  svgoPlugins: [
    {removeUnknownsAndDefaults: false},
    {cleanupIDs: false},
    {convertStyleToAttrs: true}
  ]
};

// Task: html
gulp.task('html', () =>
  gulp.src(sourcePaths.html)
    .pipe(plumber())
    .pipe(jade({
      pretty: isDev ? true : false
    }))
    .pipe(gulp.dest(buildPath))
);

// Task: scripts.
gulp.task('scripts', () =>
  gulp.src(sourcePaths.scripts)
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(gulpIf(!isDev, uglify()))
    .pipe(gulp.dest(`${buildPath}/scripts`))
);

// Task: styles.
gulp.task('styles', () =>
  gulp.src(sourcePaths.styles)
    .pipe(plumber())
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass({outputStyle: isDev ? 'expanded' : 'compressed'}))
    .pipe(postcss([
      atImport(),
      autoprefixer(autoprefixerOption)
    ]))
    .pipe(gulpIf(!isDev, cssnano()))
    .pipe(gulpIf(isDev, sourcemaps.write()))
    .pipe(gulp.dest(`${buildPath}/styles`))
    .pipe(browserSync.stream())
);

// Task: Images.
gulp.task('images', () =>
  gulp.src(sourcePaths.images)
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest(`${buildPath}/images`))
    .pipe(browserSync.stream())
);

// Task: Clean
gulp.task('clean', () => del(buildPath));

// Task: watch
gulp.task('watch', ['default', 'server'], () => {
  gulp.watch(sourcePaths.styles, ['styles']);
  gulp.watch(sourcePaths.images, ['images']);
  gulp.watch(sourcePaths.scripts, ['scripts']).on('change', browserSync.reload);
  gulp.watch(`${sourcePath}/**/*.{jade,md}`, ['html']);
});

// Task: server
gulp.task('server', () =>
  browserSync.init({
    files: `${buildPath}/**/*.html`,
    server: buildPath
  })
);

// Task: default
gulp.task('default', ['html', 'styles', 'scripts', 'images']);
