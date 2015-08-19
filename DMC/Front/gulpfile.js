var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});

var config = {};
config.buildVersion = '1.0.0';
config.temp = './build/temp/';
config.build = './build/';
config.release = config.build + 'release/';
config.tcache_file = 'templates.js';
config.tcache_options = {
    module: 'myOctopusDMC',
    standAlone: false,
    root: 'app/'
};
config.scripts_tmp_file = "preparedApp.js";

gulp.task('Step1_cleanFolders', function(){
    var folders = [].concat(config.temp, config.release);
    return gulp.src(folders, {read: false})
        .pipe($.clean());
});
gulp.task('Step2_release',['release_createAppScript','release_createAppCss','release_createComponentsScript','release_createComponentsCSS'], function(){
    return gulp
        .src('index.html')
        .pipe($.inject(gulp.src([config.release + '/components/myOctopusComponents_*.js',config.release + 'myOctopus_*.js' ]), {ignorePath: '/build/release', addRootSlash: false}))
        .pipe($.inject(gulp.src([config.release + '/components/*.css',config.release + '/*.css' ]), {ignorePath: '/build/release', addRootSlash: false}))
        .pipe(gulp.dest(config.release));
});
gulp.task('release_prepareTemplates', function(){
    return gulp
        .src('app/**/*.html')
        .pipe($.minifyHtml({empty: true }))
        .pipe($.angularTemplatecache(config.tcache_file, config.tcache_options))
        .pipe(gulp.dest(config.temp));
});
gulp.task('release_prepareAppScripts', function(){
    return gulp
        .src('app/**/*.js')
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe($.concat(config.scripts_tmp_file))
        .pipe(gulp.dest(config.temp));
});
gulp.task('release_createAppScript',['release_prepareTemplates','release_prepareAppScripts'], function(){
    var files =  [].concat(config.temp + config.scripts_tmp_file,config.temp + config.tcache_file);
    config.final_app_js = "myOctopus_" + config.buildVersion + ".js";
    return gulp
        .src(files)
        .pipe($.concat(config.final_app_js))
        .pipe($.rev())
        .pipe(gulp.dest(config.release));

});
gulp.task('release_createComponentsScript', function(){
    var assets = $.useref.assets({searchPath: './'});
    var componentsFileName = "myOctopusComponents_" + config.buildVersion + ".js";
    return gulp
        .src("index.html")
        .pipe(assets)
        .pipe($.filter('*.js'))
        .pipe($.rename(componentsFileName))
        .pipe($.useref())
        .pipe($.rev())
        .pipe(gulp.dest(config.release + '/components'));
});
gulp.task('release_createAppCss', function(){
    var styles =  [].concat("app/**/*.css","style.css");
    config.final_app_css = "myOctopus_" +  config.buildVersion + ".css";
    return gulp
        .src(styles)
        .pipe($.concat(config.final_app_css))
        .pipe($.csso())
        .pipe($.rev())
        .pipe(gulp.dest(config.release));});
gulp.task('release_createComponentsCSS', function(){
    var assets = $.useref.assets({searchPath: './'});
    var componentsCSSFileName = "myOctopus_" + config.buildVersion + ".css";
    return gulp
        .src('index.html')
        .pipe(assets)
        .pipe($.filter('*.css'))
        .pipe($.rename(componentsCSSFileName))
        .pipe($.useref())
        .pipe($.rev())
        .pipe(gulp.dest(config.release + '/components'));
});
