'use strict';

var combiner = require('stream-combiner2');
var del      = require('del');
var fs       = require('fs');
var gulp     = require('gulp');
var path     = require('path');
var rename   = require('gulp-rename');
var sass     = require('gulp-sass');
var shell    = require('shelljs');
var uglify   = require('gulp-uglify');

const CSS    = 'css';
const JSDEST = 'js';
const JSSRC  = 'src/*.js';
const MD     = 'src/*.md';
const PHP    = 'proxy/proxy.php';
const SASS   = 'sass/**/*.scss';

function changeWatcher(watcher, taskName) {
  watcher.on('change', function(event) {
    var parsed = path.parse(event.path);
    // If event.type is 'added' or 'deleted', put 'been' in between 'has' and event.type, so it's still English instead
    // of gibberish.
    if (event.type === 'changed') {
      var been = '';
    } else {
      var been = ' been';
    }
    console.log(
      'File \'' + path.join(path.relative('.', parsed.dir), parsed.base) + '\' has' + been, event.type +
      ', running tasks (originated from watcher task "' + taskName + '")...'
    );
  });
} // function changeWatcher

function compareModernizrVersions(runFromWatcherTask = false) {
  var lock = fs.readFileSync('yarn.lock', 'utf8');
  // Get the version of Modernizr in 'yarn.lock'.
  var lockMatches = /modernizr@\^[0-9.]+:\s+version "([^\"]+)"/i.exec(lock);
  if (lockMatches !== null) {
    var modernizrContent = fs.readFileSync('src/modernizr.js', 'utf8');
    // Get the version of Modernizr in 'src/modernizr.js'.
    var modernizrMatches = /_version:\s'([^']+)'/.exec(modernizrContent);
    if (modernizrMatches !== null) {
      if (lockMatches[1] === modernizrMatches[1]) {
        console.log(
          'Function \'compareModernizrVersions\': Versions in \'yarn.lock\' and \'src/modernizr.js\' are the same.'
        );
      } else {
        console.log(
          'Function \'compareModernizrVersions\': Version in \'yarn.lock\' is "' + lockMatches[1] + '". Version in ' +
          '\'src/modernizr.js\' is "' + modernizrMatches[1] + '". Building \'src/modernizr.js\'...'
        );
        shell.exec(
          'node_modules/.bin/modernizr --config node_modules/modernizr/lib/config-all.json --dest src/modernizr.js ' +
          '>/dev/null'
        );
        if (! runFromWatcherTask) {
          compileJsdoc();
        }
      }
    } else {
      // No matches? Damn, you (or the Modernizr devs) must have broken stuff! Now fix it!
      console.error(
        'ERROR (function \'compareModernizrVersions\'): The text "_version: \'vX.X.X\'" needs to be present in ' +
        '\'src/modernizr.js\' in order for this function to work correctly!'
      );
    }
    var readmeContent = fs.readFileSync('src/README.md', 'utf8');
    // Get the version of Modernizr in '/src/README.md'.
    var readmeMatches = /(Currently uses \[Modernizr\]\(https:\/\/modernizr\.com\) v)(\d+\.\d+\.\d+)/.exec(
      readmeContent
    );
    if (readmeMatches !== null) {
      if (lockMatches[1] === readmeMatches[2]) {
        console.log(
          'Function \'compareModernizrVersions\': Versions in \'yarn.lock\' and \'src/README.md\' are the same.'
        );
      } else {
        console.log(
          'Function \'compareModernizrVersions\': Version in \'yarn.lock\' is "' + lockMatches[1] + '". Version in ' +
          '\'src/README.md\' is "' + readmeMatches[2] + '". Updating \'src/README.md\'...'
        );
        readmeContent = readmeContent.replace(readmeMatches[0], readmeMatches[1] + lockMatches[1]);
        fs.writeFileSync('src/README.md', readmeContent, 'utf8');
        if (! runFromWatcherTask) {
          console.log('Function \'compareModernizrVersions\': compiling JSDoc...');
          // If this function has been called from the watcher task (not the compare task), it will detect the change to
          // 'src/README.md' and compile JSDoc automatically, so the next step isn't necessary in that case.
          compileJsdoc();
        }
      }
    } else {
      // No matches? Damn, you must have broken stuff! Now fix it!
      console.error(
        'ERROR (function \'compareModernizrVersions\'): The text "Currently uses [Modernizr](https://modernizr.com) ' +
        'vX.X.X" needs to be present in \'src/README.md\' in order for this function to work correctly!'
      );
    }
  } else {
    // No matches? Damn, you (or Yarn, or the Yarn devs) must have broken stuff! Now fix it!
    console.error('ERROR (function \'compareModernizrVersions\'): Modernizr version not found in \'yarn.lock\'!');
  }
} // function compareModernizrVersions

function compileJsdoc(runFromActionTask = false) {
  shell.exec('node_modules/.bin/jsdoc --package package.json --destination doc --readme src/README.md src/index.js');
  if (! runFromActionTask) {
    console.log('Done compiling JSDoc.');
  }
} // function compileJsdoc

function compilePhpdoc(runFromActionTask = false) {
  var json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (! fs.existsSync('doc')) {
    console.log('Folder \'doc\' doesn\'t exist, so compiling JSDoc first...');
    console.log('JSDoc is the lion\'s share of the documentation.');
    console.log('PHPDoc facilitates only some additional, supporting documentation.');
    compileJsdoc();
  }
  // Compile PHPDoc by means of phpDocumentor.
  shell.exec(
    'vendor/bin/phpdoc --filename=proxy/proxy.php --target=temp --template=new-black --title=' + json.name +
    ' >/dev/null'
  );
  // Highlight the source code by means of the PHP function higlight_file.
  shell.exec(
    'php -r "file_put_contents(\'temp/source/proxy.php.html\', highlight_file(\'proxy/proxy.php\', true));" >/dev/null'
  );
  // Make sure the folder 'source' exists in the documentation, so the steps later on succeed.
  if (! fs.existsSync('doc/' + json.name + '/' + json.version + '/source')) {
    fs.mkdirSync('doc/' + json.name + '/' + json.version + '/source', 0o775);
  }
  // Construct the source code highlighter file.
  fs.copyFileSync('src/proxy.php.html.header.tmpl', 'doc/' + json.name + '/' + json.version + '/source/proxy.php.html');
  fs.appendFileSync(
    'doc/' + json.name + '/' + json.version + '/source/proxy.php.html',
    fs.readFileSync('temp/source/proxy.php.html', 'utf8')
  );
  fs.appendFileSync(
    'doc/' + json.name + '/' + json.version + '/source/proxy.php.html',
    fs.readFileSync('src/proxy.php.html.footer.tmpl')
  );
  // Make sure the folder 'files' exists in the documentation, so the steps later on succeed.
  if (! fs.existsSync('doc/' + json.name + '/' + json.version + '/files')) {
    fs.mkdirSync('doc/' + json.name + '/' + json.version + '/files', 0o775);
  }
  // Cherry pick only the folders/files needed for the documentation.
  fs.renameSync('temp/files/proxy.html', 'doc/' + json.name + '/' + json.version + '/files/proxy.html');
  del.sync('doc/' + json.name + '/' + json.version + '/css');
  fs.renameSync('temp/css/', 'doc/' + json.name + '/' + json.version + '/css/');
  del.sync('doc/' + json.name + '/' + json.version + '/images');
  fs.renameSync('temp/images/', 'doc/' + json.name + '/' + json.version + '/images/');
  del.sync('doc/' + json.name + '/' + json.version + '/js');
  fs.renameSync('temp/js/', 'doc/' + json.name + '/' + json.version + '/js/');
  // Get rid of the folder 'temp' which has served its purpose.
  del.sync('temp/');
  if (! runFromActionTask) {
    console.log('Done compiling PHPDoc.');
  }
} // function compilePhpdoc

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                    Action tasks                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Compare versions of Modernizr in 'yarn.lock' and 'src/README.md'. Run this task for all certainty because changes in
// 'yarn.lock' could have gone unnoticed, so just compare these two files once when running gulp.
gulp.task('compare-Modernizr-versions', function() {
  compareModernizrVersions();
});

// Uglify JS.
gulp.task('js', function() {
  var combined = combiner.obj([
    gulp.src(JSSRC),
    rename(
      {
        extname: '.min.js'
      }
    ),
    uglify(),
    gulp.dest(JSDEST)
  ]);

  // Any errors in the above stream will get caught by this listener, instead of being thrown.
  combined.on('error', console.error.bind(console));

  return combined;
});

// Compile JSDoc.
gulp.task('jsdoc', function() {
  compileJsdoc(true);
});

// Compile PHPDoc by means of phpDocumentor (and highlight the source code by means of the PHP function highlight_file).
gulp.task('phpdoc', function() {
  compilePhpdoc(true);
});

// Compile Sass.
gulp.task('sass', function() {
  return gulp.src(SASS)
    .pipe(sass(
      {
        outputStyle: 'compressed'
      }
    ))
    .pipe(gulp.dest(CSS))
  ;
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                   Watcher tasks                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Watch JSSRC.
gulp.task('watch-jssrc', function() {
  var watcher = gulp.watch(JSSRC, ['js', 'jsdoc']);
  changeWatcher(watcher, 'watch-jssrc');
});

// Watch MD.
gulp.task('watch-mdsrc', function() {
  var watcher = gulp.watch(MD, ['jsdoc']);
  changeWatcher(watcher, 'watch-mdsrc');
});

// Watch package.json.
gulp.task('watch-package.json', function() {
  var watcher = gulp.watch('package.json', function() {
    var json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    // If the version has changed, then documentation for that specific version must be generated.
    if (! fs.existsSync('doc/' + json.name + '/' + json.version)) {
      compileJsdoc();
      compilePhpdoc();
    }
  });
  changeWatcher(watcher, 'watch-package.json');
});

// Watch PHP.
gulp.task('watch-php', function() {
  var watcher = gulp.watch(PHP, ['phpdoc']);
  changeWatcher(watcher, 'watch-php');
});

// Watch SASS.
gulp.task('watch-sass', function() {
  var watcher = gulp.watch(SASS, ['sass']);
  changeWatcher(watcher, 'watch-sass');
});

// Watch yarn.lock.
gulp.task('watch-yarn.lock', function() {
  var watcher = gulp.watch('yarn.lock', function() {
    compareModernizrVersions(true);
  });
  changeWatcher(watcher, 'watch-yarn.lock');
});

gulp.task(
  'default',
  [
    'compare-Modernizr-versions',
    'watch-jssrc',
    'watch-mdsrc',
    'watch-package.json',
    'watch-php',
    'watch-sass',
    'watch-yarn.lock'
  ]
);