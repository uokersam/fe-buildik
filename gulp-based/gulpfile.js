const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    csso = require('gulp-csso'),
    twig = require('gulp-twig'),
    data = require('gulp-data'),
    fs = require('fs');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'public',
    },
    notify: false,
    // open: false,
    // online: false, // Work Offline Without Internet Connection
    // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
  });
});

gulp.task('twig', function() {
  return gulp.src('app/**/*.twig').
      pipe(data(function(file) {
        return JSON.parse(fs.readFileSync('./app/parameters.json'));
      })).
      pipe(twig()).
      pipe(gulp.dest('public'));
});

gulp.task('styles', function() {
  return gulp.src('app/sass/**/*.sass').
      pipe(sass({outputStyle: 'expanded'}).on('error', notify.onError())).
      pipe(rename({suffix: '.min', prefix: ''})).
      pipe(autoprefixer(['last 4 versions'])).
      pipe(csso({
        comments: false,
      })).
      pipe(gulp.dest('public/css')).
      pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp.src([
    'app/js/common.js', // Always at the end
  ]).
      pipe(concat('scripts.min.js')).
      pipe(gulp.dest('public')).
      pipe(browserSync.reload({stream: true}));
});

gulp.task('code', function() {
  return gulp.src('public/**/*.html').
      pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function() {
  return gulp.src('app/img/**/*.*').
      pipe(gulp.dest('public/img'));
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*.*').
      pipe(gulp.dest('public/fonts'));
});

gulp.task('files', function() {
  return gulp.src('app/other/**/*.*').
      pipe(gulp.dest('public/'));
});

gulp.task('watch', function() {
  gulp.watch('app/sass/**/*.sass',
      gulp.parallel('styles'));
  gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
  gulp.watch('app/**/*.twig', gulp.parallel('code', 'twig'));
  gulp.watch('app/service/**/*.css', gulp.parallel('code', 'twig'));
  gulp.watch('app/**/*.json', gulp.parallel('code', 'twig'));
});

gulp.task('default',
    gulp.parallel('styles', 'scripts', 'img', 'fonts', 'files', 'twig',
        'browser-sync',
        'watch'));

gulp.task('prod',
    gulp.parallel('styles', 'scripts', 'img', 'fonts', 'files',
        'twig'));