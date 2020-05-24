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

/*  BUILD  */
function clean() {
  return del(['app/css/*']);
};
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
var buildSass = gulp.parallel(expandedSass, compressedSass);
var build = gulp.series(
  clean,
  gulp.parallel(buildSass)
);

// DEV
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
function watch(done) {
  gulp.watch(patterns.sass, gulp.series(buildSass, reload));
  gulp.watch(patterns.html, reload);
  done();
}
var dev = gulp.series(build, serve, watch);


module.exports.default = dev;
module.exports.sass = buildSass;
module.exports.build = build;