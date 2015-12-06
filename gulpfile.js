var concat = require('gulp-concat');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var imageminJpegtran = require('imagemin-jpegtran');
var merge = require('merge-stream');
var minifyCss = require('gulp-minify-css');
var pngquant = require('imagemin-pngquant');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

var compileScripts = function() {
  return gulp.src([
    './node_modules/aja/src/aja.js',
    './assets/scripts/main.js',
  ])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/scripts/'));
};

var compileStyles = function(source) {
  var styles = gulp.src([
    './node_modules/normalize.css/normalize.css',
    './assets/styles/vendor/**/*.css',
    './assets/styles/*.css',
  ])
    .pipe(minifyCss({
      keepSpecialComments: 0,
    }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist/assets/styles/'));

  var images = gulp.src([
    './assets/images/**/*',
  ], { base: './' })
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [
        pngquant(),
        imageminJpegtran(),
      ]
    }))
    .pipe(gulp.dest('dist'));

  return merge(styles, images);
};

gulp.task('default', function() {
  var styles = compileStyles();
  var scripts = compileScripts();
  return merge(styles, scripts);
});

gulp.task('watch', function (cb) {
    watch('assets/styles/**/*.css', function () {
        compileStyles();
    });

    watch('assets/scripts/**/*.js', function () {
        compileScripts();
    });
});
