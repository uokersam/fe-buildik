const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    // autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    // csso = require('gulp-csso'),
    // cssbeautify = require('gulp-cssbeautify'),
    twig = require('gulp-twig'),
    data = require('gulp-data'),
    fs = require('fs'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('browser-sync', () => {
  browserSync({
    server: {baseDir: 'public'},
    notify: false,
  });
});

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss').
      pipe(sourcemaps.init()).
      pipe(sass({outputStyle: 'expanded'}).
          on('error', notify.onError())).
      pipe(rename({suffix: '.min', prefix: ''})).
      // pipe(autoprefixer(['last 4 versions'])). //todo only prod version
      // pipe(csso({
      //   comments: false,
      // })).
      // pipe(cssbeautify({
      //   indent: '  ',
      //   openbrace: 'separate-line',
      //   autosemicolon: true,
      // })).
      pipe(sourcemaps.write('.')).
      pipe(gulp.dest('public/css')).
      pipe(browserSync.stream());
});

gulp.task('twig', () => {
  return gulp.src('app/**/*.twig').
      pipe(data(function(file) {
        return JSON.parse(fs.readFileSync('app/options.json'));
      })).
      pipe(twig()).
      pipe(gulp.dest('public'));
});

gulp.task('scripts', () => {
  return gulp.src([
    'app/scripts/jquery.min.js',
    'app/scripts/likely.js',
    'app/scripts/highlight.pack.js',
    'app/scripts/buttons.js',
    'app/scripts/share.js',
    'app/scripts/common.js', // Always at the end
  ]).
      pipe(concat('scripts.min.js')).
      pipe(gulp.dest('public')).
      pipe(browserSync.reload({stream: true}));
});

gulp.task('code', () => {
  return gulp.src('public/**/*.html').
      pipe(browserSync.reload({stream: true}));
});

gulp.task('assets', () => {
  return gulp.src([
    'app/assets/**/*.*',
  ]).
      pipe(gulp.dest('public/assets/'));
});

gulp.task('watch', () => {
  gulp.watch('app/**/*.scss', gulp.parallel('styles'));
  gulp.watch('app/**/*.js', gulp.parallel('scripts', 'code', 'twig'));
  gulp.watch(['app/js/common.js'], gulp.parallel('scripts'));
  gulp.watch('app/**/*.twig', gulp.parallel('code', 'twig'));
  gulp.watch('app/options.json', gulp.parallel('code', 'twig', 'styles'));
});

gulp.task('default',
    gulp.parallel('styles', 'scripts', 'assets', 'twig',
        'browser-sync',
        'watch'),
);

gulp.task('prod',
    gulp.parallel('styles', 'scripts', 'assets', 'twig'),
);