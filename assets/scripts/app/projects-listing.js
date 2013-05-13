define([
  'jquery', 'ejs/ejs', 'sugar'
], function($, ejs, sugar) {

  function removeDisabledProjects(db, disabled_metadata) {
    db.projects.remove(function(project) {
      return disabled_metadata.find(function(disabled_project_name) {
        return (project.name == disabled_project_name);
      }) !== undefined;
    });
  }

  function setupProjectsContent(db, projects_metadata) {
    var pm = projects_metadata.projects; /* alias */

    db.projects.each(function(project, index) {

      //                                                 1. Shown Name
      if (projects_metadata.hasOwnProperty('projects') &&
        pm.hasOwnProperty(project.name)) {
        if (pm[project.name].hasOwnProperty('replaceNameWith')) {
          project.shownName = pm[project.name].replaceNameWith;
        } else { project.shownName = project.name; }
      } else { project.shownName = project.name; }
      project.shownName = project.shownName.titleize();

      //                                                 2. Description
      if (project.hasOwnProperty('description')) {
        project.hasDetails = true;
      }

      //                                                 3. Buttons
      project.buttons = [];
      var push_button = function(name, link, in_title, in_content) {
        project.buttons.push({ name: name, link: link,
          in_title: in_title, in_content: in_content });
      };
      //                                                   3.1 Source Code
      push_button('source_code', project.svn_url, false, true);
      //                                                   3.2 Wiki
      if (project.hasWiki) {
        push_button('wiki', project.svn_url + "/wiki", true, true);
      }
    });
  }

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

        if (projects_metadata.hasOwnProperty('disabled') &&
            Object.isArray(projects_metadata.disabled)) {
          removeDisabledProjects(db, projects_metadata.disabled);
        }

        setupProjectsContent(db, projects_metadata);

        console.log(db);

        new EJS({ url: template_url }).update(wrapper_id, db);

      });
    });
  });


  /* == Projects Listing export ============================================= */

  return {};

});
