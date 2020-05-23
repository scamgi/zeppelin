var del = require('del');
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

var server = browserSync.create();

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
      baseDir: './app'
    }
  });
  done();
}

function buildSass() {
  return gulp.src('app/scss/*.scss')
    .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest('./app/css'));
}

function watch() {
  return gulp.watch('./app/scss/*.scss', gulp.series(buildSass, reload));
}

var dev = gulp.series(clean, buildSass, serve, watch);
module.exports.default = dev;