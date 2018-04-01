'use strict';

/**
 * Document that has been retrieved by getting the contents of the Modernizr Documentation page at
 * https://modernizr.com/docs and then DOMified by means of the jQuery parseHTML function.
 * Because that page is on another domain, simply getting it by means of AJAX wasn't an option, so this page is
 * retrieved by means of a (very) simple PHP script that acts as proxy. Potentially that could be harmful if the
 * Modernizr Documentation page would have been injected with malware, but as it's kept in a separate variable instead
 * of being injected in the current document's DOM, I think the risk is really low to non-existent.
 * @type {String}
 */
var doc;
/**
 * Text for constructing a title attribute, where the documentation of the feature retrieved from the Modernizr
 * Documentation page will be stored.
 * @type {String}
 */
var title = '';
/**
 * Text for the HTML class to indicate support for a detected feature.
 * @type {String}
 * @property {String} supported - The feature is supported.
 * @property {String} not-supported - The feature is not supported.
 * @property {String} unknown - It is unknown if the feature is supported or not.
 */
var support;
/**
 * Text for the H1 tag.
 * @type {String}
 */
var h1 = 'Modernizr v';
for (var i = 0; i <= 4; i++) {
  h1 += Modernizr['_version'][i];
}
$('h1').html(h1);

// Wrap the code inside the success function of the GET proxy request, so its data is available to act upon. Downside is
// that it takes a little longer before the table is shown, but otherwise the title attributes would have to be
// manipulated afterwards, which would have been much harder to code. For me it only takes less than a second before the
// GET proxy request has been fulfilled.
$.get('proxy/', function(data) {
  // DOMify the retrieved data from the Modernizr Documentation page.
  doc = $.parseHTML(data);
  // Loop through all features.
  for (var item in Modernizr) {
    // Skip the features beginning with '_', which actually aren't features at all.
    if (item.substr(0, 1) !== '_') {
      // Construct the title attribute.
      title = $('tr > td > b:contains("' + item + '")', doc).parent().parent().next().find('td > p').text();
      // Some features have subitems which not only can be true or false, but also text like 'maybe' or 'probably',
      // which get a neutral colour.
      if (typeof Modernizr[item] !== 'boolean') {
        for (var subItem in Modernizr[item]) {
          if (typeof (Modernizr[item][subItem]) !== 'boolean') {
            support = 'unknown';
          } else if (Modernizr[item][subItem]) {
            support = 'supported';
          } else {
            support = 'not-supported';
          }
          // Generate another row for the feature table.
          if (title != undefined) {
            $('#table > tbody').append(
              '<tr title="' + title + '"><td><span class="' + support + '">' + item + '.' + subItem +
              '</span></td><td><span class="' + support + '">' + Modernizr[item][subItem].toString() +
              '</span></td></tr>'
            );
          } else {
            // Sometimes the documentation of the current feature could not be found, so in that case leave out the
            // title attribute.
            $('#table > tbody').append(
              '<tr><td><span class="' + support + '">' + item + '.' + subItem + '</span></td><td><span class="' +
              support + '">' + Modernizr[item][subItem].toString() + '</span></td></tr>'
            );
          }
        }
      } else {
        // No subitem, so only true or false.
        if (Modernizr[item]) {
          support = 'supported';
        } else {
          support = 'not-supported';
        }
        // Generate another row for the feature table.
        if (title != undefined) {
          $('#table > tbody').append(
            '<tr title="' + title + '"><td><span class="' + support + '">' + item + '</span></td><td><span class="' +
            support + '">' + Modernizr[item].toString() + '</span></td></tr>'
          );
        } else {
          // Sometimes the documentation of the current feature could not be found, so in that case leave out the title
          // attribute.
          $('#table > tbody').append(
            '<tr><td><span class="' + support + '">' + item + '</span></td><td><span class="' + support + '">' +
            Modernizr[item].toString() + '</span></td></tr>'
          );
        }
      }
    }
  }
  // Make the table really cool by means of DataTables (paging, searching and eye candy, among other things).
  $('#table').DataTable({
    'order'     : [[0, "asc"]],
    'pageLength': 25,
    'responsive': true
  });
});