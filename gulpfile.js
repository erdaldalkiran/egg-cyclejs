var gulp = require('gulp');
var babelify = require('babelify');
var sourcemaps = require("gulp-sourcemaps");
var del = require('del');
var connect = require('gulp-connect');
var open = require('gulp-open');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var config = {
    port: 9001,
    devBaseUrl: 'http://localhost',
    absoluteUrl: function () {
        return this.devBaseUrl + ':' + this.port + '/';
    },

    paths: {
        js: './src/**/*.js',
        mainJs: './src/main.js',
        html: './src/**/*.html',
        destination: './dist/'
    }
};

gulp.task('clean', function(){
    "use strict";

    del(config.paths.destination);

});

gulp.task('connect', function () {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task('open', ['connect'], function () {
    gulp.src('dist/index.html')
        .pipe(open({uri: config.absoluteUrl()}));
});

gulp.task('js', function () {
    "use strict";

    var bundler = browserify({
        entries: config.paths.mainJs,
        debug: true
    });
    bundler.transform(babelify);

    bundler.bundle()
        .on('error', function (err) { console.error(err); })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.paths.destination))
        .pipe(connect.reload());
});

gulp.task('html', function(){
    "use strict";

    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.destination));
});

gulp.task('watch', function () {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
});

gulp.task('default', ['clean', 'js', 'html', 'connect', 'watch']);
