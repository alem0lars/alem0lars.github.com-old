requirejs.config({

  // By default load any module IDs from js/lib
  baseUrl: '/assets/scripts/lib',

  // If the module ID starts with "app", load it from the "js/app" dir.
  // "paths" config is relative to the baseUrl, and never includes a ".js"
  // extension since the paths config could be for a directory.
  paths: {
    app: '../app'
  },

  shim: {

    // jQuery shims
    'jquery': { deps: [], exports: '$' },

    // Zurb-Foundation shims
    'zurb-foundation/foundation': ['jquery', 'modernizr'],
    'zurb-foundation/foundation-alerts':      ['zurb-foundation/foundation', 'jquery', 'modernizr'],
    'zurb-foundation/foundation-clearing':    ['zurb-foundation/foundation', 'jquery', 'modernizr'],
    'zurb-foundation/foundation-cookie':      ['zurb-foundation/foundation', 'jquery', 'modernizr'],
    'zurb-foundation/foundation-dropdown':    ['zurb-foundation/foundation', 'jquery', 'modernizr'],
    'zurb-foundation/foundation-forms':       ['zurb-foundation/foundation', 'jquery', 'modernizr'],
    'zurb-foundation/foundation-joyride':     ['zurb-foundation/foundation', 'jquery', 'modernizr'],
    'zurb-foundation/foundation-magellan':    ['zurb-foundation/foundation', 'jquery', 'modernizr'],
    'zurb-foundation/foundation-orbit':       ['zurb-foundation/foundation', 'jquery', 'modernizr'],
    'zurb-foundation/foundation-placeholder': ['zurb-foundation/foundation', 'jquery', 'modernizr'],
    'zurb-foundation/foundation-reveal':      ['zurb-foundation/foundation', 'jquery', 'modernizr'],
    'zurb-foundation/foundation-section':     ['zurb-foundation/foundation', 'jquery', 'modernizr'],
    'zurb-foundation/foundation-tooltips':    ['zurb-foundation/foundation', 'jquery', 'modernizr'],
    'zurb-foundation/foundation-topbar':      ['zurb-foundation/foundation', 'jquery', 'modernizr'],

    // EJS shims
    'ejs/ejs': [],
    'ejs/view': ['ejs/ejs'],

    // Other libs shims
    'sugar': [],
    'modernizr': [],
    'monkeybars': []

  }
});

function get_requires() {
  var requires = [

    // jQuery requires
    'jquery',

    // Zurb-Foundation requires
    'zurb-foundation/foundation',
    'zurb-foundation/foundation-alerts',
    'zurb-foundation/foundation-clearing',
    'zurb-foundation/foundation-cookie',
    'zurb-foundation/foundation-dropdown',
    'zurb-foundation/foundation-forms',
    'zurb-foundation/foundation-joyride',
    'zurb-foundation/foundation-magellan',
    'zurb-foundation/foundation-orbit',
    'zurb-foundation/foundation-placeholder',
    'zurb-foundation/foundation-reveal',
    'zurb-foundation/foundation-section',
    'zurb-foundation/foundation-tooltips',
    'zurb-foundation/foundation-topbar',

    // EJS requires
    'ejs/ejs',
    'ejs/view',

    // Other libs requires
    'sugar',
    'modernizr',
    'monkeybars',

    // App - Generic - requires
    'app/foundation-init',
    'app/logger',
    'app/auth'
  ];

  /* { Utility functions */

  var on_page = function (names, required_name) {
    if (!(names instanceof Array)) {
      names = [names];
    }

    for (var idx = 0; idx < names.length; idx++) {
      var name = names[idx];

      if ((name == window.location.pathname) ||
          (("/" + name) == window.location.pathname) ||
          ((name + ".html") == window.location.pathname) ||
          (("/" + name + ".html") == window.location.pathname)) {
        requires.push(required_name);
      }
    }

    return requires;
  };

  /* } */

  /* { Requires for specific pages */
  on_page(['index', '/'], 'app/projects-listing');
  /* } */

  return requires;
}

requirejs(get_requires());
