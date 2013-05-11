define([
  'jquery', 'mustache/mustache', 'sugar'
], function($, Mustache, sugar) {

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
        console.log(data);
      });
  }

  // Load the template
  function initTemplate() {
    $.get(
      'projects-listing.html',
      function(data) { template = data; }
    );
  }

  // Render the template against the db
  function renderTemplate() {
    // When AJAX calls are complete parse the template,
    // replacing mustache tags with vars
    $(document).ajaxStop(function() {
      var renderedPage = Mustache.to_html(template, db);
      $('#projects-listing-content').html(renderedPage);
    });
  }


  $(document).ready(function() {
    initDb();
    initTemplate();
    renderTemplate();
  });


  /* == Projects Listing export ============================================= */

  return {};

});
