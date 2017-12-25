const gulp = require('gulp')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const del = require('del')

const paths = {
    babel: 'src/**/*.js',
    html: 'src/**/*.html',
    assets: 'src/app/assets/**/*.*'
}

gulp.task('clean', function () {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del.sync(['dest'])
})

gulp.task('babel', () => {
    return gulp.src(paths.babel)
        .pipe(babel())
        .pipe(gulp.dest('dest'))
})

gulp.task('sass', () => {
    return gulp.src('src/app/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dest/app/'))
})

gulp.task('html', () => {
    return gulp.src(paths.html)
        .pipe(gulp.dest('dest'))
})

gulp.task('assets', () => {
    return gulp.src(paths.assets)
        .pipe(gulp.dest('dest/app/assets'))
})

gulp.task('build', ['clean', 'html', 'babel', 'sass', 'assets'])

gulp.task('watch', ['build'], function () {
    gulp.watch(paths.babel, ['babel'])
    gulp.watch('src/app/**/*.scss', ['sass'])
    gulp.watch(paths.html, ['html'])
    gulp.watch(paths.assets, ['assets'])
})



