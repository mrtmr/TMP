/**
 *
 *  TRUMANDEV CRAFT KIT (CRAFT 2.3)
 *  AUTHOR: MRTMR
 *
 */

'use strict';

// VARIABLES *************

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var sass = require('gulp-sass');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'last 2 versions',
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// TASKS *************

// HTML
gulp.task('html', function(){
  return gulp.src('craft/templates/**/*.html')
    .pipe($.livereload());
});

// JS Hint & Uglify
// Check JS for syntax errors, minify & move to html/assets
gulp.task('scripts', function () {
  return gulp.src('_src/js/**/*.js')
    //check JS syntax
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest('html/assets/js'))
    .pipe($.livereload());
});

gulp.task('scripts-min', function () {
  return gulp.src('_src/js/**/*.js')
    //check JS syntax
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    //uglify to html
    .pipe($.uglify())
    .pipe(gulp.dest('html/assets/js'))
    .pipe($.livereload());
});

// Sass & Autoprefix
// Compile and Automatically Prefix Stylesheets for chosen browsers
gulp.task('styles', function () {
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
      '_src/scss/*.scss'
    ])
    .pipe($.changed('styles', {extension: '.scss'}))
    .pipe($.sass({
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    // Concatenate and minify styles
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('html/assets/css'))
    .pipe($.size({title: 'styles'}))
    .pipe($.livereload());
});

// Optimize Images
// Optimizes images for deployment & overwrites original files
gulp.task('images', function () {
  return gulp.src('html/assets/img/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('html/assets/img'))
    .pipe($.size({title: 'img'}));
});

// Watch Files For Changes & Reload
// Uncomment proxy and change to dev site local url
gulp.task('sync', ['styles', 'scripts'], function () {

  browserSync({
      proxy: "http://tmp.craft.dev",
      xip: true
  });

  gulp.watch(['craft/templates/**/*.html'], reload);
  gulp.watch(['_src/scss/**/*.scss'], ['styles', reload]);
  gulp.watch(['_src/js/**/*.js'], ['scripts', reload]);
  gulp.watch(['html/assets/images/**/*'], ['images', reload]);
});

// Watch Files For Changes & Reload
// Uncomment proxy and change to dev site local url
gulp.task('default', ['styles', 'scripts-min', 'html'], function () {

  $.livereload.listen();

  gulp.watch(['craft/templates/**/*.html'], ['html']);
  gulp.watch(['_src/scss/**/*.scss'], ['styles']);
  gulp.watch(['_src/js/**/*.js'], ['scripts']);
  gulp.watch(['html/assets/images/**/*'], ['images']);
});

// Watch Files For Changes & Reload
// Uncomment proxy and change to dev site local url
gulp.task('dist', ['styles', 'scripts-min'], function () {
});
