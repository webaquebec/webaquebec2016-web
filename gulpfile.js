var args = require('yargs').argv;
var autoprefixer = require('gulp-autoprefixer');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var gulpUtil = require('gulp-util');
var jsdoc = require("gulp-jsdoc");
var mergeStream = require('merge-stream');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var scsslint = require('gulp-scss-lint');
var tslint = require('gulp-tslint');
var webpack = require('webpack');
var WebpackServer = require("webpack-dev-server");

var isDebug = args.type == 'Debug';
var isDebugAssets = false;
var mainFile = args.mainfile;
var mCompiler;
gulp.task('default', ['compile']);
gulp.task('watch', Watch);
gulp.task('full_build', ['compile_assets', 'build']);
gulp.task('compile', ['lint', 'build']);
gulp.task('compile_assets', CompileAssets);
gulp.task('webserver', WebServer);
gulp.task('sass', CompileSass);
gulp.task('lint', DoLinting);
gulp.task('build', CompileScripts);

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

function Watch() {
    
    gulp.watch('assets/json/**/*.json', ['compile_assets']);
    gulp.watch('assets/stylesheets/**/*.scss', ['sass']);
    gulp.watch('assets/templates/**/*.html', ['compile_assets']);
}

function WebServer(compiler) {
	
	var config = require('./webpack.server.config.js');
	
	gulpUtil.log(JSON.stringify(config));
	
	gulpUtil.log("[webpack-dev-server] root: ", config.contentBase);
	
    new WebpackServer(compiler, config).listen(config.port, "localhost", function(err) {
		if(err) {
			throw new gulpUtil.PluginError("webpack-dev-server", err);
		}
		gulpUtil.log("[webpack-dev-server]", "server listening on " + config.port);
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

function CompilerCallback(err, stats){
		
	if(err){
		throw new gulpUtil.PluginError("webpack", err);
	}
	
	gulpUtil.log("[webpack]", stats.toString({colors:true}));
	
	WebServer(mCompiler);
}

function CompileScripts() {
	
	var config = require('./webpack.config.js');
	
	gulpUtil.log(JSON.stringify(config));
	
    mCompiler = webpack(config, CompilerCallback.bind(this));
	

}