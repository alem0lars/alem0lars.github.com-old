define([
  'jquery', 'ejs/ejs', 'sugar'
], function($, ejs, sugar) {

  $(document).ready(function() {
    var wrapper_id = 'projects-content';
    var github_url =
        'https://api.github.com/users/{un}/repos?'.assign({ un: 'alem0lars' });
    var projects_metadata_url = '/data/projects.json';
    var template_url = '/projects-listing.html';
    var db;         // JSON database object that feeds the template

    $.getJSON(github_url, function(github_data) {
      db = { projects: github_data };

      $.getJSON(projects_metadata_url, function(projects_metadata) {
        if (projects_metadata.hasOwnProperty('disabled') && Object.isArray(projects_metadata.disabled)) {
          db.projects.remove(function(project) {
            return projects_metadata.disabled.find(function(disabled_project_name) {
              return (project.name == disabled_project_name);
            }) !== undefined;
          });
        }
        new EJS({ url: template_url }).update(wrapper_id, db);
      });
    });
  });


  /* == Projects Listing export ============================================= */

  return {};

});
