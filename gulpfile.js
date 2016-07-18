var gulp = require('gulp'),
  connect = require('gulp-connect'),
  browserify = require("browserify"),
  source = require('vinyl-source-stream');
  tsify = require("tsify")
  ts = browserify({
      basedir: '.',
      debug: true,
      entries: ['app/src/ts/main.ts'],
      cache: {},
      packageCache: {}
  })
  .plugin(tsify)
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest("app/dist/js"));
 
gulp.task('connect', ['compile-ts', 'copy-html'], function() {
  connect.server({
    root: 'app/dist',
    livereload: true
  });
});

gulp.task('html', ['copy-html'], function () {
  gulp.src('./app/src/views/*')
    .pipe(gulp.dest('./app/dist/views/'))
    .pipe(connect.reload());  
});

gulp.task('compile-ts', function(){
  return ts;
});

gulp.task('ts', function(){
  ts.pipe(connect.reload());
});
 
gulp.task('copy-html', function () {
  gulp.src('./app/src/views/*')
    .pipe(gulp.dest('./app/dist/views/'));
});

gulp.task('watch', function () {
  gulp.watch(['./app/src/**/*.ts'], ['ts']);  
  gulp.watch(['./app/src/**/*.html'], ['html'])
});

 
gulp.task('build', ['connect', 'watch']);