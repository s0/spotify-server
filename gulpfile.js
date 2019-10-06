var gulp = require('gulp');
var clean = require('gulp-clean');
var gutil = require("gulp-util");
var ts = require('gulp-typescript');

var tsProject = ts.createProject('src/tsconfig.json');

// Utility Functions

function handleError(err) {
  gutil.log("Build failed", err.message);
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

gulp.task('default', gulp.series('clean', 'ts'));
