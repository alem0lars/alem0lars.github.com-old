define([
  'jquery', 'ejs/ejs', 'sugar'
], function($, ejs, sugar) {

  // Template for the Projects Listing
  var template;

  // JSON database object that feeds the template
  var db = {};

  // Initialize and fill informations in the db
  function initDb() {
    // Retrieve the server data
    $.getJSON("data/projects.json", function(data) { $.extend(db, data); } );

    $.getJSON(
      'https://api.github.com/users/{u_n}/repos?'.assign({ u_n: 'alem0lars' }),
      function(data) {
        $.extend(db, data);
      }
    );
  }

  // Render the template against the db
  function renderTemplate() {
    // When AJAX calls are complete parse the template
    $(document).ajaxStop(function() {
      new EJS({url: '/projects-listing.html'}).update('projects-listing-content', db);
    });
  }


  $(document).ready(function() {
    initDb();
    renderTemplate();
  });


  /* == Projects Listing export ============================================= */

  return {};

});
