var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var _ = require('lodash');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var DEBUG = util.env.debug || process.env.NODE_ENV === 'debug';

module.exports = function(buildConfig, watch){
  var dest = buildConfig.dest || './dist';
  var buildDir = buildConfig.buildDir || './scripts/build';
  var bundleOptions = _.extend({
    entries: buildConfig.src,
    insertGlobals: true,
    debug: DEBUG
  }, watchify.args, (buildConfig.bundleOptions || {}));
  // set up the browserify instance on a task basis
  var b = browserify(bundleOptions);

  // apply the transforms here to fix problem with babelify recursively
  //  calling itself and multiplying build times
  b.transform(babelify.configure({
    ignore: /(node_modules)|(vendor)|(static)|(build)/,
    sourceMaps: 'inline'
  }));

  // wrap browserify in watchify for faster builds
  if (watch) {
    b = watchify(b);
    b.on('update', bundle);
    b.on('log', function(msg){
      gutil.log('Change detected in source for bundle: '+buildConfig.bundleName);
      gutil.log('Updating Bundle...');
      gutil.log(msg);
    });
  }

  function bundle() {
    return b.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source(buildConfig.src))
      .pipe(buffer())
      .pipe(rename(buildConfig.bundleName))
      .pipe(gulp.dest(buildDir))
      .pipe(gulpif(!DEBUG, uglify()))
      .pipe(gulp.dest(dest));
  }

  return bundle;
}