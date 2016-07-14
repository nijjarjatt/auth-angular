var gulp = require('gulp'),
  connect = require('gulp-connect'),
  browserify = require("browserify"),
  source = require('vinyl-source-stream');
  tsify = require("tsify");
 
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./app/**/*.html')
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src('./app/**/*.js')
    .pipe(connect.reload());
});

gulp.task('ts', function(){
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['app/assets/ts/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("app/assets/js"));

});
 
gulp.task('watch-html', function () {
  gulp.watch(['./app/**/*.html'], ['html']);
});

gulp.task('watch-js', function () {
  gulp.watch(['./app/**/*.js'], ['js']);
});

gulp.task('watch-ts', function () {
  gulp.watch(['./app/**/*.ts'], ['ts', 'watch-js']);
});

 
gulp.task('default', ['connect', 'watch-ts', 'watch-html']);