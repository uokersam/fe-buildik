const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    csso = require('gulp-csso'),
    cssbeautify = require('gulp-cssbeautify');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app',
    },
    notify: false,
    // open: false,
    // online: false, // Work Offline Without Internet Connection
    // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
  });
});

gulp.task('styles', function() {
  return gulp.src('app/scss/**/*.scss').
      pipe(sass({outputStyle: 'expanded'}).on('error', notify.onError())).
      pipe(rename({suffix: '.min', prefix: ''})).
      pipe(autoprefixer(['last 15 versions'])).
      pipe(csso({
        comments: false,
      })).
      pipe(cssbeautify({
        ndent: '  ',
        openbrace: 'separate-line',
        autosemicolon: true,
      })).
      pipe(gulp.dest('app/css')).
      pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp.src([
    'app/js/common.js', // Always at the end
  ]).
      pipe(concat('scripts.min.js')).
      pipe(gulp.dest('app/js')).
      pipe(browserSync.reload({stream: true}));
});

gulp.task('code', function() {
  return gulp.src('app/*.html').pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss',
      gulp.parallel('styles'));
  gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
  gulp.watch('app/*.html', gulp.parallel('code'));
});
gulp.task('default',
    gulp.parallel('styles', 'scripts', 'browser-sync', 'watch'));
