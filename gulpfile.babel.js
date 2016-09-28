'use strict';

import cssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import babel from 'gulp-babel';
import bs from 'browser-sync';
import concat from 'gulp-concat';
import cssnano  from 'gulp-cssnano';
import data from 'gulp-data';
import del from 'del';
import gulp from 'gulp';
import environments from 'gulp-environments';
import imagemin from 'gulp-imagemin';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import sass from 'gulp-sass';
import sftp from 'gulp-sftp';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

import { site } from './package.json';
import deployOptions from './.deploy-options.json';

const development = environments.development;
const production = environments.production;

// Paths to the source code.
const sourceDir = 'source';
const sourcePaths = {
  html: `${sourceDir}/html/*.{pug,html,md}`,
  icons: `${sourceDir}/icons/*.css`,
  images: `${sourceDir}/images/**/*.{png,jpg,svg}`,
  scripts: `${sourceDir}/scripts/**/*.js`,
  styles: `${sourceDir}/styles/**/*.scss`
};

// Path to the application.
const buildDir = development() ? 'app' : 'build';

// Options of plugins.
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

const bsOptions = {
  files: [
    `${buildDir}/**/*.html`,
    `${buildDir}/**/*.js`
  ],
  server: buildDir
};

// Task: HTML. =================================================================
gulp.task('html', () =>
  gulp.src(sourcePaths.html)
    .pipe(plumber())
    .pipe(data(() => site))
    .pipe(pug({
      pretty: development() ? true : false
    }))
    .pipe(gulp.dest(buildDir))
);

// Task: scripts. ==============================================================
gulp.task('scripts', () =>
  gulp.src(sourcePaths.scripts)
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(production(uglify()))
    .pipe(gulp.dest(`${buildDir}/scripts`))
);

// Task: styles. ===============================================================
gulp.task('styles', () =>
  gulp.src(sourcePaths.styles)
    .pipe(plumber())
    .pipe(development(sourcemaps.init()))
    .pipe(sass({outputStyle: development() ? 'expanded' : 'compressed'}))
    .pipe(postcss([
      cssImport(),
      autoprefixer(autoprefixerOption)
    ]))
    .pipe(production(cssnano()))
    .pipe(development(sourcemaps.write()))
    .pipe(gulp.dest(`${buildDir}/styles`))
    .pipe(bs.stream())
);

// Task: Images. ===============================================================
gulp.task('images', () =>
  gulp.src(sourcePaths.images)
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest(`${buildDir}/images`))
    .pipe(bs.stream())
);

// Task: Clean. ================================================================
gulp.task('clean', () => del(buildDir));

// Task: watch. ================================================================
gulp.task('watch', ['default'], () => {
  bs.init(bsOptions);
  gulp.watch(sourcePaths.styles, ['styles']);
  gulp.watch(sourcePaths.images, ['images']);
  gulp.watch(sourcePaths.scripts, ['scripts']).on('change', bs.reload);
  gulp.watch(`${sourceDir}/**/*.{pug,md,html}`, ['html']);
});

// Task: server. ===============================================================
gulp.task('server', () => bs.init(bsOptions));

// Task: deploy. ===============================================================
gulp.task('deploy', () =>
  gulp.src(`${buildDir}/**/*`)
    .pipe(sftp(deployOptions))
);

// Task: default. ==============================================================
gulp.task('default', ['html', 'styles', 'scripts', 'images']);
