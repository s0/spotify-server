var gulp = require('gulp');
var clean = require('gulp-clean');
var PluginError = require("plugin-error");
var ts = require('gulp-typescript');
var webpack = require('webpack');

var tsProject = ts.createProject('src/tsconfig.json');

// Utility Functions

function handleError(err) {
  throw new PluginError("Build failed", err.message);
  process.exit(1);
}

gulp.task('clean', function() {
  return gulp.src(['build'], {read: false, allowEmpty: true}).pipe(clean());
});

gulp.task('ts', function () {
    return tsProject.src()
      .pipe(tsProject())
      .on('error', handleError)
      .pipe(gulp.dest('build'));
});



gulp.task('webpack', function (callback) {
  // run webpack
  webpack({
    entry: {
      player: './build/player/index.js',
    },
    output: {
      filename: "[name].js",
      path: __dirname + "/build/static"
    },
    mode: 'development',
    devtool: 'source-map-inline',
  }, function (err, stats) {
    if (err) throw new PluginError("webpack", err);
    callback();
  });
});

gulp.task('default', gulp.series('clean', 'ts', 'webpack'));
