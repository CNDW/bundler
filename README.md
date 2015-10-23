# Gulp-Bundler
==============
An unofficial gulp plugin for using Browserify, Bable, and Gulp.

Very early alpha, expect major changes to make the plugin better align with the gulp philosophy

## Installation

  npm install gulp-bundler --save-dev

## Usage

```javascript
var gulp = require('gulp');
var bundler = require('gulp-bundler');

gulp.task('build', function(){
  return bundler({
    bundleName: 'myBundle.js',
    src: './scripts/index.js',
    dest: './dist',
    buildDir: './build'
  });
});

gulp.task('build:watch', function(){
  return bundler({
    bundleName: 'myBundle.js',
    src: './scripts/index.js',
    dest: './dist',
    buildDir: './build'
  }, true);
)};
```
### bundler(config{obj}, watch{bool})

    Passing watch will return a bundler function wrapped in watchify for development.

###`bundleName`
    *required
    type: String
    The name of the output bundle
###`src`
    *required
    type: String | Array[String]
    The source files for the package. Uses a path relative to the project root that may be a glob selector, or specific file. This property may optionally be an array of paths.
###`dest`
    *optional
    type: String
    The destination directory for the package. If no dest is given, the directory defined in `(gulp/config.js).scripts.dest` will be used.
###`buildDir`
    *optional
    type: String
    The destination directory for unminified, unpublished versions of the build files, defaults to `./scripts/build`
###`bundleOptions`
    *optional
    type: Object
    Any bundle specific options that will be passed into browserify.
