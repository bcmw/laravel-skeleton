'use strict';

var gulp   = require('gulp'),
    $      = require('gulp-load-plugins')(),
    del    = require('del'),
    notify = require('gulp-notify'),
    run    = require('run-sequence'),
    fs     = require('fs'),
    bs     = require('browser-sync').create(),
    revDel = require('rev-del');

////////////////////
// GLOBAL OPTIONS //
////////////////////
var options = {
  production: false,
  bs: {
    domain: 'localhost',
    public_root: '',
    open: false
  }
};

////////////////
// BASE PATHS //
////////////////
var paths = {
  base:      {
    bower: 'bower_components',
    src:   'resources',
    build: 'resources/build',

    dest: {
      main:     'public/assets',
      critical: 'resources/views/_assets'
    }
  }
};

(function() {
  var cli_args = require('nopt')({
    env: String,
    domain: String,
    production: Boolean,
    open: Boolean
  }, {
    d: '--domain',
    o: '--open'
  });

  options.production = cli_args.env === 'production' || cli_args.production;
  options.bs.domain = cli_args.domain || options.bs.domain;
  options.bs.open = !!cli_args.open;

  var root_path = '', dir = __dirname;
  while (dir.length) {
    if (fs.existsSync(dir + '/Vagrantfile')) {
      break;
    }

    var i = dir.lastIndexOf('/');
    root_path = dir.substring(i + 1) + '/' + root_path;
    dir = dir.substring(0, i);
  }

  if (__dirname + '/' == '/' + root_path) {
    root_path = '';
  } else {
    root_path = root_path.substring(0, root_path.length - 1);
  }

  if (cli_args.domain === '') {
    options.bs.domain = root_path.split('/').reverse().join('.') + '.dev';
  }

  if (fs.existsSync('public') && fs.statSync('public').isDirectory()) {
    root_path += '/public';
  }

  options.bs.public_root = root_path;

  if (fs.existsSync('.bowerrc')) {
    paths.base.bower = require('./.bowerrc').directory || paths.base.bower;
  }

  //////////////////
  // SOURCE PATHS //
  //////////////////
  paths.src = {
    scss: {
      critical: [
        paths.base.src + '/scss/critical/**/*.scss'
      ],
      main:     [
        paths.base.src + '/scss/main/**/*.scss'
      ]
    },
    js:   {
      critical: [
        paths.base.src + '/js/critical/**/*.js'
      ],
      main:     [
        paths.base.src + '/js/main/**/*.js'
      ]
    },
    img:  [
      paths.base.src + '/img/**/*.{png,jpg,jpeg,gif,svg}'
    ]
  };

  ////////////////
  // COPY TASKS //
  ////////////////
  paths.copy = {
    'fonts': {src: paths.base.src + '/font/**',
              dest: paths.base.dest.main + '/font'}
  };

  /////////////////////
  // BOWER LIB PATHS //
  /////////////////////
  paths.bower = {
    scss: {
      base: [
        'bourbon/app/assets/stylesheets/bourbon',
        'neat/app/assets/stylesheets/neat'
      ],
      critical: [
        'normalize-css/scss/critical'
      ],
      main: [
        'normalize-css/scss/main'
      ]
    },
    js: {
      critical: [
        'loadCSS/loadCSS',
        'loadCSS/onloadCSS',
        'loadJS/loadJS'
      ],
      main: [
        //
      ]
    },
    copy: {
      'jquery': {src: 'jquery/dist/**',
                 dest: paths.base.dest.main + '/common/js/jquery'}
    }
  };

  // ignore partials
  paths.src.scss.critical.push('!**/_*.scss');
  paths.src.scss.main.push('!**/_*.scss');
  paths.src.js.critical.push('!**/_*.js');
  paths.src.js.main.push('!**/_*.js');
})();

///////////
// UTILS // *** DO NOT EDIT UNLESS YOU KNOW WHAT YOU'RE DOING ***
///////////
var utils = {
  ensureBuildDir: function() {
    if (!fs.existsSync(paths.base.build)) fs.mkdirSync(paths.base.build);
  },

  buildFilePath: function(name) {
    return paths.base.build + '/' + name;
  },

  isBuildFileClean: function(name) {
    var path = this.buildFilePath(name);

    if (!fs.existsSync(path)) return false;

    var gulpfile_stat = fs.statSync(__filename),
        build_file_stat = fs.statSync(path);

    return build_file_stat.mtime.getTime() >= gulpfile_stat.mtime.getTime();
  },

  writeBuildFile: function(name, content) {
    this.ensureBuildDir();
    var path = this.buildFilePath(name);

    fs.writeFileSync(path, content.join('\n'));
  },

  makeBowerBuildFile: function (name, ext, lines, formatter) {
    if (utils.isBuildFileClean('_bower_' + name + '.' + ext)) return;

    var contents = [];

    contents.push('// DO NOT EDIT THIS FILE. IT IS AUTO-GENERATED AND WILL BE OVERWRITTEN BY THE BUILD SYSTEM.');
    contents.push('');

    for (var q = 0; q < lines.length; q++) {
      if (typeof lines[q] === 'function') {
        contents.push(lines[q]());
      } else {
        lines[q] += '';
        if (!lines[q].match(new RegExp('\\.' + ext + '$'))) lines[q] += '.' + ext;
        contents.push(formatter('../../' + paths.base.bower + '/' + lines[q]));
      }
    }

    utils.writeBuildFile('_bower_' + name + '.' + ext, contents);
  },

  errorCallback: function (label) {
    return function (err) {
      var path = (err.fileName || err.file),
          line = (err.lineNumber || err.line),
          column = (err.column || 0),
          relative = path.substr(__dirname.length + 1),
          location = relative + ' @ ' + line + ':' + column;

      var message = err.message;
      message = message.replace(new RegExp('\\W*' + path + '\\W*'), '');
      message = message.replace(new RegExp('\\W*' + relative + '\\W*'), '');
      message = message.replace(new RegExp('\\W*' + line + '([^0-9 ]' + column + ')?\\W*'), '');

      console.error('***');
      console.error(label + ' ERROR!!');
      console.error(message);
      console.error(location);
      console.error('***');

      if (options.production) {
        throw err;
      } else {
        notify.onError(function() {
          return label + ' ERROR!!\n'
              + message + '\n'
              + location;
        }).call(this, err);

        this.emit('end');
      }
    }
  }
};

/**
 * Copies bower components' public assets to publicly-accessible paths
 */
gulp.task('bower:copy', function(cb) {
  var tasks = [];

  for (var key in paths.bower.copy) {
    if (!paths.bower.copy.hasOwnProperty(key)) continue;

    gulp.task('bower:copy:' + key, (function (key) { return function () {
      var lib = paths.bower.copy[key];

      var src = lib.src;
      if (typeof src === 'string') src = [src];
      for (var q = 0; q < src.length; q++) {
        src[q] = paths.base.bower + '/' + src[q];
      }

      if (lib.srcopts && lib.srcopts.base) lib.srcopts.base = paths.base.bower + '/' + lib.srcopts.base;

      return gulp.src(src).pipe($.newer(lib.dest)).pipe(gulp.dest(lib.dest));
    };})(key));

    tasks.push('bower:copy:' + key)
  }

  if (tasks.length) run(tasks, cb);
  else if (cb) cb();
});

/**
 * Creates the bower import files for scss
 *
 * Creates resources/build/_bower_XXX.scss
 */
gulp.task('bower:scss', function(cb) {
  var tasks = [];

  for (var key in paths.bower.scss) {
    if (!paths.bower.scss.hasOwnProperty(key)) continue;

    gulp.task('bower:scss:' + key, (function (key) { return function () {
      utils.makeBowerBuildFile(key, 'scss', paths.bower.scss[key], function (path) {
        return '@import "' + path + '";';
      });
    };})(key));

    tasks.push('bower:scss:' + key);
  }

  if (tasks.length) run(tasks, cb);
  else if (cb) cb();
});

/**
 * Creates the bower import files for js
 *
 * Creates resources/build/_bower_XXX.js
 */
gulp.task('bower:js', function(cb) {
  var tasks = [];

  for (var key in paths.bower.js) {
    if (!paths.bower.js.hasOwnProperty(key)) continue;

    gulp.task('bower:js:' + key, (function (key) { return function () {
      utils.makeBowerBuildFile(key, 'js', paths.bower.js[key], function (path) {
        return '//= include ' + path;
      });
    };})(key));

    tasks.push('bower:js:' + key);
  }

  if (tasks.length) run(tasks, cb);
  else if (cb) cb();
});

/**
 * Creates the bower versions import file for js
 *
 * Creates resources/build/_bower_versions.js
 */
gulp.task('bower:versions', function() {
  return gulp.src(paths.base.bower + '/*/.bower.json')
      .pipe($.bowerVersions({variable: 'BowerComponents'}))
      .pipe(gulp.dest(paths.base.build + '/_bower_versions.js'));
});

/**
 * Copies .css files to .scss files in bower components so they can be imported in scss
 */
gulp.task('bower:scss:css_to_scss', function() {
  return gulp.src([paths.base.bower + '/**/*.css', '!' + paths.base.bower + '/**/*.min.css'], {base: paths.base.bower})
      .pipe($.newer({dest: paths.base.bower, ext: '.scss'}))
      .pipe($.rename({extname: '.scss'}))
      .pipe(gulp.dest(paths.base.bower));
});

/**
 * Compiles critical scss stylesheets
 */
gulp.task('scss:critical', function() {
  return gulp.src(paths.src.scss.critical, {base: paths.base.src})
      .pipe($.sourcemaps.init())
      .pipe($.sass({
        outputStyle: options.production ? 'compressed' : 'nested'
      }))
      .on('error', utils.errorCallback('SCSS'))
      .pipe($.if(!options.production, $.sourcemaps.write({sourceRoot: '/' + paths.base.src})))
      .pipe($.rename(function (path) {
        path.dirname = path.dirname.replace(/(\/|^)scss(\/|$)/, '/css/').replace(/(\/|^)critical(\/|$)/, '/');
        path.basename += '_css';
        path.extname = '.twig';
      }))
      .pipe(gulp.dest(paths.base.dest.critical))
      .pipe($.size({title: 'critical css'}));
});

/**
 * Compiles async scss stylesheets
 */
gulp.task('scss:main', ['clean:sourcemaps:scss'], function() {
  return gulp.src(paths.src.scss.main, {base: paths.base.src})
      .pipe($.sourcemaps.init())
      .pipe($.sass({
        outputStyle: options.production ? 'compressed' : 'nested'
      }))
      .on('error', utils.errorCallback('SCSS'))
      .pipe($.rename(function (path) {
        path.dirname = path.dirname.replace(/(\/|^)scss(\/|$)/, '/css/').replace(/(\/|^)main(\/|$)/, '/');
        path.extname = '.min.css';
      }))
      .pipe($.rev())
      .pipe($.if(!options.production, $.sourcemaps.write('.', {
        sourceRoot: function(file) {
          return file.path.replace(/^resources/, '').substr(1).replace(/[^\/]+/ig, '..') + '/../resources/';
        }
      })))
      .pipe(gulp.dest(paths.base.dest.main))
      .pipe($.size({title: 'main css'}))
      .pipe($.rev.manifest({ merge: true, path: 'storage/app/asset-manifest.json', base: 'storage/app' }))
      .pipe(revDel({ dest: paths.base.dest.main, oldManifest: 'storage/app/asset-manifest.json' }))
      .pipe(gulp.dest('storage/app'));
});

gulp.task('clean:sourcemaps:scss', function() {
  return del(paths.base.dest.main + '/css/**/*.map')
});

/**
 * Compiles critical js scripts
 */
gulp.task('js:critical', function() {
  return gulp.src(paths.src.js.critical, {base: paths.base.src})
      .pipe($.include())
      .pipe($.cache($.uglify({
        mangle: !!options.production
      })))
      .on('error', utils.errorCallback('JS'))
      .pipe($.rename(function (path) {
        path.dirname = path.dirname.replace(/(\/|^)critical(\/|$)/, '/');
        path.basename += '_js';
        path.extname = '.twig';
      }))
      .pipe(gulp.dest(paths.base.dest.critical))
      .pipe($.size({title: 'critical js'}));
});

/**
 * Compiles async js scripts
 */
gulp.task('js:main', ['clean:sourcemaps:js'], function() {
  return gulp.src(paths.src.js.main, {base: paths.base.src})
      .pipe($.sourcemaps.init())
      .pipe($.include())
      .pipe($.cache($.uglify({
        mangle: !!options.production
      })))
      .on('error', utils.errorCallback('JS'))
      .pipe($.rename(function (path) {
        path.dirname = path.dirname.replace(/(\/|^)main(\/|$)/, '/');
        path.extname = '.min.js';
      }))
      .pipe($.rev())
      .pipe($.if(!options.production, $.sourcemaps.write('.', {
        sourceRoot: function(file) {
          return file.path.replace(/^resources/, '').substr(1).replace(/[^\/]+/ig, '..') + '/../resources/';
        }
      })))
      .pipe(gulp.dest(paths.base.dest.main))
      .pipe($.size({title: 'main js'}))
      .pipe($.rev.manifest({ merge: true, path: 'storage/app/asset-manifest.json', base: 'storage/app' }))
      .pipe(revDel({ dest: paths.base.dest.main, oldManifest: 'storage/app/asset-manifest.json' }))
      .pipe(gulp.dest('storage/app'));
});

gulp.task('clean:sourcemaps:js', function() {
  return del(paths.base.dest.main + '/js/**/*.map')
});

/**
 * Builds custom modernizr script
 *
 * Creates resources/build/modernizr.js
 */
gulp.task('modernizr', function() {
  return gulp.src([paths.base.src + '/**/*.scss', paths.base.src + '/**/*.js', '!' + paths.base.src + '/build/_modernizr.js'])
      .pipe($.modernizr('_modernizr.js', {
        paths: ['setClasses', 'addTest', 'html5printshiv', 'testProp', 'fnBind']
      }))
      .pipe(gulp.dest(paths.base.src + '/build'));
});

/**
 * Copies bower components' public assets to publicly-accessible paths
 */
gulp.task('copy', function(cb) {
  var tasks = [];

  for (var key in paths.copy) {
    if (!paths.copy.hasOwnProperty(key)) continue;

    gulp.task('copy:' + key, (function (key) { return function () {
      var task = paths.copy[key];

      var src = task.src;
      if (typeof src === 'string') src = [src];
      src.push('!**/.git*');

      return gulp.src(src).pipe($.newer(task.dest)).pipe(gulp.dest(task.dest));
    };})(key));

    tasks.push('copy:' + key)
  }

  if (tasks.length) run(tasks, cb);
  else if (cb) cb();
});

/**
 * Compresses images
 */
gulp.task('img', function() {
  return gulp.src(paths.src.img, {base: paths.base.src})
      .pipe($.cache($.imagemin({
        progressive: true,
        interlaced:  true
      })))
      .pipe(gulp.dest(paths.base.dest.main))
      .pipe($.size({title: 'images'}));
});

/**
 * Compiles all CSS (critical and async)
 */
gulp.task('css', ['bower:scss', 'bower:scss:css_to_scss'], function(cb) {
  run(['scss:critical', 'scss:main'], cb);
});

/**
 * Compiles all JS (critical and async)
 */
gulp.task('js', ['bower:js', 'bower:versions', 'modernizr'], function(cb) {
  run(['js:critical', 'js:main'], cb);
});

/**
 * Clears the gulp-cache cache
 */
gulp.task('clean:cache', function (cb) {
  return $.cache.clearAll(cb);
});

/**
 * Cleans all built artifacts
 */
gulp.task('clean:files', function () {
  var cleanPaths = [
    '.tmp',
    paths.base.dest.critical,
    paths.base.dest.main,
    paths.base.build
  ];

  for (var key in paths.copy) {
    if (!paths.copy.hasOwnProperty(key)) continue;

    cleanPaths.push(paths.copy[key].dest);
  }

  return del(cleanPaths, {dot: true});
});

/**
 * Performs a complete clean
 */
gulp.task('clean', function(cb) {
  run(['clean:cache', 'clean:files'], cb);
});

/**
 * Runs all compile tasks (CSS and JS)
 */
gulp.task('compile', function(cb) {
  run(['css', 'js'], cb);
});

gulp.task('default', options.production ? ['clean'] : [], function(cb) {
  run(['copy', 'bower:copy', 'img', 'compile'], cb);
});

gulp.task('watch', ['default'], function() {
  gulp.watch([paths.base.src + '/**/*.js', '!' + paths.base.build + '/**'], ['js']);
  gulp.watch([paths.base.src + '/**/*.scss', '!' + paths.base.build + '/**'], ['css']);
  gulp.watch(paths.base.src + '/**/*.{png,jpg,jpeg,gif,svg}', ['img']);
});

gulp.task('serve', ['watch'], function () {
  if (options.bs.domain != 'localhost') {
    // this is kinda hacky and uses browsersync's internal functionality. may break. consult val.
    bs.instance.events.on('options:set', function (event) {
      if (event.path == 'urls' && event.value.get('local').match(/^https?:\/\/localhost(:|\/)/i)) {
        bs.instance.setOptionIn(['urls', 'local'], event.value.get('local').replace('//localhost', '//' + options.bs.domain));
        bs.instance.setOptionIn(['urls', 'ui'], event.value.get('ui').replace('//localhost', '//' + options.bs.domain));
      }
    });
  }

  bs.init({
    ui: { port: 8000 },
    port: 8888,
    reloadDebounce: 1000,
    open: options.bs.open ? 'ui' : false,
    files: [
      paths.base.dest.main + '/**/*.js',
      paths.base.dest.main + '/**/*.css',
      paths.base.dest.main + '/**/*.{png,jpg,jpeg,gif,svg}'
    ],
    proxy: {
      target: 'http://' + options.bs.domain + ':8080/' + options.bs.public_root + '/'
    }
  });

  gulp.watch(['app/**', 'resources/lang/**', 'resources/views/**']).on('change', function () {
    bs.reload();
  });
});
