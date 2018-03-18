var gulp = require('gulp');
var watch = require('gulp-watch');
var webpack = require('webpack');
var config = require('./webpack.config.js');

gulp.task('build', function (done) {
  webpack(config).run(function (err, stats) {
    if (err) {
      console.log('GulpWebpackError', err);
    } else {
      console.log(stats.toString());
    }
  });
});
