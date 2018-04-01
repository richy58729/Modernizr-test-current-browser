This module shows a table with all the features [Modernizr](https://modernizr.com) provides where each cell indicates
if the current browser supports the feature or not.

If documentation about the feature could be distilled from the [Modernizr Documentation](https://modernizr.com/docs), it
will be shown when hovering the mouse cursor over the table row of the feature. This doesn't work 100% flawlessly, but
most of the time I think it's quite handy despite this.

Currently uses [Modernizr](https://modernizr.com) v3.6.0.<br/>
Uses [DataTables](https://www.datatables.net) for formatting the features in a handy table with search capability and
pagination.

Author: [R.J. Vrijhof](https://www.vrijhof.info) <<r@vrijhof.info>><br/>
License: [MIT](https://opensource.org/licenses/MIT)

If you're further developing this module, you'll need:
- [Yarn](https://yarnpkg.com), to get Modernizr, JSDoc, gulp and the dependencies 'gulpfile.js' needs (NPM could work
  too, but you'll have to change 'gulpfile.js' so it watches 'package-lock.json' instead of 'yarn.lock' in the
  'watch-yarn.lock' task, unless you don't care about gulp and want to do stuff by hand)
- [gulp](https://gulpjs.com)
- [Composer](https://getcomposer.org), to get phpDocumentor (or get phpDocumentor by hand instead); installed globally
  by the way
- [JSDoc](https://github.com/jsdoc3/jsdoc)
- [phpDocumentor](https://phpdoc.org), installed by means of Composer

<hr style="border-bottom-color: #000; border-bottom-width: 1px; margin-left: 1em; margin-right: auto; width: 80em" />

- [Jump to source code of index.js, the workhorse of this module](index.js.html)
- [Jump to documentation of proxy.php, which is used by index.js to retrieve the Modernizr Documentation web
  page](files/proxy.html)
- [Jump to module home](../../..)