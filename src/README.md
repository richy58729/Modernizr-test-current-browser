Author: [R.J. Vrijhof](https://www.vrijhof.info) <<r@vrijhof.info>><br/>
License: [MIT](https://opensource.org/licenses/MIT)

#### Usage ####

This module shows a table with all the features [Modernizr](https://modernizr.com) provides where each cell indicates
if the current browser supports the feature or not.

If documentation about the feature could be distilled from the [Modernizr Documentation](https://modernizr.com/docs), it
will be shown when hovering the mouse cursor over (or tapping on touchscreens) the table row of the feature. This
doesn't work 100% flawlessly, but most of the time I think it's quite handy despite this.

- Currently uses [Modernizr](https://modernizr.com) v3.6.0.
- Uses [Bitters](https://bitters.bourbon.io).
- Uses [Bourbon](https://www.bourbon.io).
- Uses [DataTables](https://www.datatables.net) for formatting the features in a handy table with search capability and
  pagination.
- Uses [jQuery](https://jquery.com).
- Uses the [jQuery Loader plugin](https://plugins.jquery.com/loader).
- Uses the [jQuery miniTip plugin](https://plugins.jquery.com/miniTip).
- Uses the [jQuery Touchable plugin](https://github.com/dotmaster/Touchable-jQuery-Plugin).
- Uses [Neat](https://neat.bourbon.io).
- Uses [normalize-scss](https://github.com/JohnAlbin/normalize-scss).
- Uses [Sass](https://sass-lang.com) (yes, it's really written as [Sass, not SASS](http://sassnotsass.com)).

Set up to work on Apache. Could easily work in other web servers as well, however, some folders/files will be accessible
from the web browser, because they have been protected with .htaccess files that only work in Apache. There should be no
harm done, as there's not really sensitive information in those folders/files.

You'll need PHP as well.

#### Development ####

If you're further developing this module, you'll need:
- [Composer](https://getcomposer.org), to get phpDocumentor (or get phpDocumentor by hand instead).
- [gulp](https://gulpjs.com), for automating building, compiling, etc.
- [JSDoc](https://github.com/jsdoc3/jsdoc), to make the development documentation's welcome page and for documenting
  JavaScript.
- [phpDocumentor](https://phpdoc.org), for documenting PHP (there's a simple PHP script that's used as a proxy to
  retrieve the [Modernizr Documentation](https://modernizr.com/docs)).
- [Yarn](https://yarnpkg.com), to get Modernizr, JSDoc, gulp and the dependencies 'gulpfile.js' needs (NPM could work
  too, but you'll have to change 'gulpfile.js' so it watches 'package-lock.json' instead of 'yarn.lock' in the
  'watch-yarn.lock' task, unless you don't care about gulp and want to do stuff by hand).


1. Run yarn. It will fetch all modules and dependencies present in 'package.json'.
2. Start gulp and keep it running. It watches several files for changes and automatically builds and compiles stuff, and
   such.

<hr style="border-bottom-color: #000; border-bottom-width: 1px; margin-left: 1em; margin-right: auto; width: 80em" />

- [Jump to source code of index.js, the workhorse of this module](index.js.html)
- [Jump to documentation of proxy.php, which is used by index.js to retrieve the Modernizr Documentation web
  page](files/proxy.html)
- [Jump to module home](../..)