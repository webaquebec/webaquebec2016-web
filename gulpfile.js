var autoprefixer = require('gulp-autoprefixer');
var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var mergeStream = require('merge-stream');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var scsslint = require('gulp-scss-lint');
var tslint = require('gulp-tslint');

gulp.task('default', ['compile_assets']);
gulp.task('compile_assets', CompileAssets);
gulp.task('sass', CompileSass);
gulp.task('lint', DoLinting);

function DoLinting() {
    // Linting the typescript
    function lintTS() {
        return gulp.src('src/**/*.ts')
            .pipe(tslint())
            .pipe(tslint.report('prose', {
                reportLimit: 4
            }));
    }

    function lintSASS() {
        return gulp.src('assets/stylesheets/**/*.scss')
            .pipe(scsslint({
                'config': 'scsslint.yml'
            }));
    }

    //lintSASS();
    return lintTS();
}

function CompileSass() {

    return gulp.src('assets/stylesheets/**/*.scss')
        .pipe(sass({
            style: 'compressed'
        })
        .on('error', gulpUtil.log)
        .on('error', gulpUtil.beep))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulp.dest('www/assets'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('www/assets'));
}

function CompileJson() {

    return gulp.src('assets/json/**/*.json')
        .pipe(gulp.dest('www/json/'));
}

function CompileAssetsImg() {
    return gulp.src('assets/img/**/*')
        .pipe(gulp.dest('www/img/'));
}

function CompileAssetsSvg() {
    return gulp.src('assets/svg/**/*')
        .pipe(gulp.dest('www/svg/'));
}

function CompileAssetsFonts() {
    return gulp.src('assets/fonts/*')
        .pipe(gulp.dest('www/fonts/'));
}

function CompileTemplates() {
    return gulp.src('assets/templates/**/*.html')
        .pipe(gulp.dest('www/templates/'));
}

function CompilePdf() {
    return gulp.src('assets/pdf/*')
        .pipe(gulp.dest('www/pdf/'));
}

function CompileAssets() {

    return mergeStream(
        CompileSass(),
        CompileJson(),
        CompileAssetsImg(),
        CompileAssetsSvg(),
        CompileAssetsFonts(),
        CompileTemplates(),
        CompilePdf()
    );
}
