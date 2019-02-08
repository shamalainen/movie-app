// ---------------
// General plugins
// ---------------
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var rename = require('gulp-rename');
var del = require('del');
var noop = require('gulp-noop');

// ------------
// Sass plugins
// ------------
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var autoprefix = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');

// ----------------------------
// Javascript plugins
// ----------------------------
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var babel = require('gulp-babel');

// ------
// Config
// ------
var basePath = {
  src: './app/src/',
  assets: './app/assets/',
};

var path = {
  styles: {
    src: basePath.src + 'scss/',
    assets: basePath.assets + 'css/',
  },
  scripts: {
    src: basePath.src + 'js/',
    assets: basePath.assets + 'js/',
  },
};

function compileSASS() {
  return gulp
    .src(path.styles.src + '**/*.scss')
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(
      autoprefix({
        browsers: ['last 2 versions'],
      })
    )
    .pipe(path.env !== 'development' ? cleanCss() : noop())
    .pipe(gulp.dest(path.styles.assets))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function copyScripts() {
  return (
    gulp
      .src(path.scripts.src + '**/*.js')
      .pipe(concat('scripts.js'))
      // .pipe(
      //   babel({
      //     presets: ['@babel/env'],
      //   })
      // )
      .pipe(path.env !== 'development' && false ? uglify() : noop())
      .pipe(
        rename({
          suffix: '.min',
        })
      )
      .pipe(gulp.dest(path.scripts.assets))
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
}

function runWatch() {
  gulp.watch(path.styles.src + '**/*.scss', compileSASS);
  gulp.watch(path.scripts.src + '**/*.js', copyScripts);
}

function browserSyncInit() {
  browserSync.init({
    server: {
      baseDir: './app',
    },
    files: './app/index.html',
  });
}

function cleanAssets(done) {
  del('./app/assets');
  done();
}

function cleanDist(done) {
  del('./dist');
  done();
}

function copyToDist(done) {
  gulp.src('./app/index.html').pipe(gulp.dest('./dist/'));

  gulp.src('./app/assets/**/*').pipe(gulp.dest('./dist/assets/'));

  done();
}

gulp.task('watch', gulp.series(runWatch));

gulp.task('default', gulp.parallel('watch', browserSyncInit), function(done) {
  done();
});

gulp.task(
  'dist',
  gulp.series(cleanDist, cleanAssets, compileSASS, copyScripts, copyToDist),
  function(done) {
    done();
  }
);

gulp.task('dev', function(done) {
  environment('development');
  done();
});

function environment(env) {
  console.log('Running tasks in ' + env + ' mode.');
  return (path.env = env);
}
