var args = require('yargs').argv;
var autoprefixer = require('gulp-autoprefixer');
var gulp = require('gulp');
var gulpRimRaf = require('gulp-rimraf');
var gulpConnect = require('gulp-connect');
var gulpIf = require('gulp-if');
var gulpUtil = require('gulp-util');
var jsdoc = require("gulp-jsdoc");
var mergeStream = require('merge-stream');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var scsslint = require('gulp-scss-lint');
var webpack = require('webpack');
var tslint = require('tslint');
var isDebug = args.type == 'Debug';
var isDebugAssets = false;
var mainFile = args.mainfile;

gulp.task('default', ['compile']);
gulp.task('watch', Watch);
gulp.task('full_build', ['compile_assets', 'build']);
gulp.task('compile', ['lint', 'build']);
gulp.task('compile_assets', CompileAssets);
gulp.task('clean', CleanBuildDir);
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
    
    gulp.watch('src/**/*.ts', ['build']);
    gulp.watch('assets/json/**/*.json', ['compile_assets']);
    gulp.watch('assets/stylesheets/**/*.scss', ['sass']);
    gulp.watch('assets/templates/**/*.html', ['compile_assets']);

    return WebServer();
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

function CompileScripts() {
    
	// run webpack
    webpack({  
		entry: './src/com/cortex/waq/main/Main.ts',
		output: {
			filename: 'www/assets/app.js'
		},
			//devtool: 'source-map',
		resolve: {
			extensions: ['', 'lib/', '.webpack.js', '.web.js', '.ts', '.js']
		},
		module: {
			loaders: [
			{ test: /\.ts$/, loader: 'ts-loader' }
			]
		}
	},function(err, stats) {
		
        if(err) throw new gulpUtil.PluginError("webpack", err);
		
        gulpUtil.log("[webpack]", stats.toString({
            // output options
        }));
    });
	
	gulpConnect.reload();
}
function CleanBuildDir() {
    
    return gulp.src(['www/img', 'www/json', 'www/templates', 'www/lib/', 'www/assets'])
        .pipe(gulpRimRaf({force:true}));
}
