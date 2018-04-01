<?php
/**
 * Very simple script to act as proxy to retrieve the Modernizr Documentation web page.
 *
 * This script acts as a proxy to retrieve the [Modernizr Documentation](https://modernizr.com/docs). The checks in this
 * script are simple and fallable checks to prevent misuse. As the scenarios for misuse are rather limited (as in: I
 * can't imagine this script to be misused in any way, but maybe I lack imagination), I guess these simple checks should
 * suffice. Hey, at least I have **considered** security and that's more than you can say of most IoT manufacturers...
 *
 * <hr style="border-bottom-color: #000; border-bottom-width: 1px; margin-left: 1em; margin-right: auto; width: 80em" />
 *
 * [Jump back to JSDoc](..)
 *
 * @author R.J.Vrijhof <r@vrijhof.info>
 * @license https://opensource.org/licenses/MIT MIT
 * @package Modernizr-test
 */

// If HTTP_REFERER exists, check if it is one directory up, ending with either a slash or a slash and 'index.html'. Also
// check if HTTP_X_REQUESTED_WITH is 'XMLHttpRequest' (jQuery sends this header when doing a GET AJAX request).
if (isset($_SERVER['HTTP_REFERER'])) {
  if (
    (
      $_SERVER['HTTP_REFERER'] === ($_SERVER['HTTPS'] ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . dirname(
        $_SERVER['REQUEST_URI']
      ) . '/' ||
      $_SERVER['HTTP_REFERER'] === ($_SERVER['HTTPS'] ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . dirname(
        $_SERVER['REQUEST_URI']
      ) . '/index.html'
    ) &&
    $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest'
  ) {
    // Send the contents of the Modernizr Documentation page.
    echo file_get_contents('https://modernizr.com/docs');
  } else {
    // Send a forbidden (403) response header (a.k.a. 'Fuck off, I don't like you!').
    http_response_code(403);
  }
// If HTTP_REFERER doesn't exist, check only HTTP_X_REQUESTED_WITH.
} elseif ($_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
  // Send the contents of the Modernizr Documentation page.
  echo file_get_contents('https://modernizr.com/docs');
} else {
  // Send a forbidden (403) response header (a.k.a. 'Fuck off, I don't like you!').
  http_response_code(403);
}

?>