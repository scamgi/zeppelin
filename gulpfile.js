var del = require('del');
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var rename = require('gulp-rename');
var server = browserSync.create();

var patterns = {
  base: './app',
  sass: './app/scss/*.scss',
  html: './app/*.html',
  destSass: './app/css'
};

function clean() {
  return del(['app/css/*']);
};

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: patterns.base
    }
  });
  done();
}

function expandedSass() {
  return gulp.src(patterns.sass)
    .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(patterns.destSass));
}

function compressedSass() {
  return gulp.src(patterns.sass)
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(rename({extname:'.min.css'}))
    .pipe(gulp.dest(patterns.destSass));
}


function watch(done) {
  gulp.watch(patterns.sass, gulp.series(expandedSass, reload));
  gulp.watch(patterns.html, reload);
  done();
}

module.exports.default = gulp.series(clean, expandedSass, serve, watch);
module.exports.sass = gulp.series(
  clean,
  gulp.parallel(expandedSass, compressedSass)
  );