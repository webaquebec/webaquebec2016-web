var args = require('yargs').argv;
var autoprefixer = require('gulp-autoprefixer');
var gulp = require('gulp');
var gulpClean = require('gulp-clean');
var gulpConcat = require('gulp-concat');
var gulpConnect = require('gulp-connect');
var gulpCopy = require('gulp-copy');
var gulpIf = require('gulp-if');
var gulpTypescript = require('gulp-tsc');
var gulpUglify = require('gulp-uglify');
var gulpUtil = require('gulp-util');
var jsdoc = require("gulp-jsdoc");
var jsonminify = require('gulp-jsonminify');
var mergeStream = require('merge-stream');
var minifycss = require('gulp-minify-css');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var scsslint = require('gulp-scss-lint');
var tslint = require('gulp-tslint');

var isDebug = args.type == 'Debug';
var isDebugAssets = false;
var mainFile = args.mainfile;

gulp.task('default', ['compile']);
gulp.task('watch', Watch);
gulp.task('compile', ['compile_assets', 'build_project']);
gulp.task('compile_assets', CompileAssets);
gulp.task('pull_dependencies', PullDependencies);
gulp.task('clean', CleanBuildDir);
gulp.task('webserver', WebServer);
gulp.task('sass', CompileSass);
gulp.task('lint', DoLinting);
gulp.task('build_project', BuildProject);
gulp.task('doc', GenerateDocs);
gulp.task('compile_test', CompileTest);
gulp.task('test', ['compile_test'], RunTest);


function DoLinting() {
    // Linting the typescript
    function lintTS() {
        return gulp.src('src/**/*.ts')
            .pipe(tslint())
            .pipe(tslint.report('verbose'));
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

function Watch() {
    gulp.watch('src/**/*.ts', ['build_project']);
    gulp.watch('assets/json/**/*.json', ['compile_assets']);
    gulp.watch('assets/stylesheets/**/*.scss', ['sass']);
    gulp.watch('assets/templates/**/*.html', ['compile_assets']);

    return WebServer();
}

function BuildProject() {
    var compileType = (args.type == undefined) ? "is undefined reverting to release" : "in " + args.type;

    gulpUtil.log("compile type " + compileType);

    if (isDebug) {
        return CompileScripts(true, false);
    } else {
        return CompileScripts(false, true);
    }
}

function WebServer() {
    return gulpConnect.server({
        root: 'www'
    });
}

function CompileSass() {
    return gulp.src('assets/stylesheets/*.scss')
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
        .pipe(gulpIf(!isDebugAssets, minifycss()))
        .pipe(gulp.dest('www/assets'))
        .pipe(gulpConnect.reload());
}

function PullDependencies() {
    return mergeStream(
        gulp.src('node_modules/requirejs/require.js').pipe(gulp.dest('www/lib/require')),
        gulp.src('bower_components/routie/lib/routie.js').pipe(gulp.dest('www/lib/routie')),
        gulp.src('assets/lib/tmpl.js').pipe(gulp.dest('www/lib/blueimp-tmpl')),
        gulp.src('node_modules/jquery/dist/jquery.js').pipe(gulp.dest('www/lib/jquery')),
        gulp.src('node_modules/velocity-animate/velocity.js').pipe(gulp.dest('www/lib/velocity-animate')),
        gulp.src('bower_components/font-awesome/css/*.css').pipe(gulpCopy('www/lib/',{prefix: 3})),
        gulp.src('bower_components/font-awesome/fonts/*').pipe(gulpCopy('www/fonts', {prefix: 3}))
    );
}

function CompileJson() {
    // Copy des fichiers json dans le dossier des JSON
    return gulp.src('assets/json/**/*.json')
        //.pipe(gulpIf(!isDebugAssets, jsonminify()))
        .pipe(gulp.dest('www/json/'));
}

function CompileAssetsImg() {
    // Copy des assets img to www/img
    return gulp.src('assets/img/**/*')
        .pipe(gulp.dest('www/img/'));
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
        CompileTemplates(),
        CompilePdf()
    );
}

function CompileScripts(aSourceMap, aRemoveComment)
{
    return gulp.src('src/com/cortex/template/main/Main.ts')
        .pipe(gulpTypescript({
            sourcemap: aSourceMap,
            removeComments: aRemoveComment,
            target: 'ES5',
            module: 'amd',
        })
        .on('error', gulpUtil.log)
        .on('error', gulpUtil.beep))

        // minify javascripts
        //.pipe(gulpIf(!isDebugAssets, gulpUglify()))

        .pipe(gulp.dest('www/assets'))
        .pipe(gulpConnect.reload());
}

function GenerateDocs() {
    return gulp.src('src/**/*.ts')
        .pipe(gulpTypescript({
            sourcemap: false,
            removeComments: false,
            target: 'ES5',
            module: 'commonjs'
        }))
        .pipe(jsdoc('./doc', './doc_template'));
}

function CompileTest() {
    return gulp.src('test_typescript/**/*.ts')
                .pipe(gulpTypescript({
                    sourcemap: false,
                    sortOutput: true,
                    removeComments: true,
                    target: "ES5",
                    out: "app.js"
                }))
                .pipe(gulpConcat('output.js'))
                .pipe(gulp.dest('www/assets'));
}

function RunTest() {
    return gulp.src('test/*.js')
        .pipe(mocha());
}

function CleanBuildDir() {
    return gulp.src(['www/img', 'www/json', 'www/templates', 'www/lib/', 'www/assets'])
        .pipe(gulpClean({force:true}));
}
