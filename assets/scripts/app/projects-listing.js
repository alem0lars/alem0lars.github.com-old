define([
  'jquery', 'ejs/ejs', 'monkeybars', 'sugar'
], function ($, ejs, monkeybars, sugar) {

  /**
   * Remove the disabled projects ('disbl_prj_names') from the 'db'
   *
   * @param db
   * @param {[String]} disbl_prj_names List of projects names to be disabled
   */
  function rm_disbl_prjs (db, disbl_prj_names) {
    db.prjs.remove(function(prj) {
      return disbl_prj_names.find(function(disbl_prj_name) {
        return (prj.name == disbl_prj_name);
      }) !== undefined;
    });
  }

  /**
   * Override the property 'src_prop' (in 'prj')
   * with the 'trgt_prop' (if available in 'cust_mtd.prjs[prj.name]');
   * otherwise with the 'fallback' value in the project metadata 'prj'
   *
   * @param prj
   * @param cust_mtd
   * @param src_prop
   * @param trgt_prop
   * @param fallback
   */
  function override_prop (prj, cust_mtd, src_prop, trgt_prop, fallback) {
    if (cust_mtd.prjs && cust_mtd.prjs.hasOwnProperty(prj.name)) {
      prj_cust_mtd = cust_mtd.prjs[prj.name];
      if (prj_cust_mtd.hasOwnProperty(src_prop)) {
        prj[trgt_prop] = prj_cust_mtd[src_prop];
      } else if (fallback !== undefined) { prj[trgt_prop] = fallback; }
    } else if (fallback !== undefined) { prj[trgt_prop] = fallback; }
  }

  function create_files_task (prj_name, files_info) {
    // TODO
    // var files_inner_tasks = files_info.map(function (file_info) {
    //   // Create a MonkeyBars.Task for each file
    //   var file_inner_tasks = file_info.exts.map(function(ext) {
    //     // The URL for a file
    //     var url = "https://github.com/{un}/{pn}/raw/master/{fn}{en}".assign({
    //       un: 'alem0lars', pn: prj_name, fn: file_info.name, en: ext
    //     });

    //     return new MonkeyBars.Task({
    //       name: "Fetcher<{fn}{ext}>".assign({ fn: file_info.name, en: ext }),
    //       performTask: function () {
    //         var self = this;
    //         $.ajax({
    //           url: url,
    //           global: false,
    //           success: function (data, status, jq_xhr) {
    //             self.complete(data);
    //           }
    //         })
    //         .fail(function () {
    //           self.complete();
    //         });
    //       }
    //     });
    //   });

    //   /* Run the extensions task (a MonkeyBars.Task for each extension of the
    //    * current file) for the current file
    //    */
    //   return new MonkeyBars.ParallelTask({
    //     name: file_info.name,
    //     tasks: file_inner_tasks,
    //     concurrent: false, /* try the different exts for a file concurrently */
    //     handleProduct: function (product) {
    //       var self = this;
    //       console.log("Product: " + product);
    //       /* FCFS (the others products will be ignored) */
    //       if (self.product === undefined) {
    //         self.product = product;
    //       }
    //     },
    //     onComplete: function () {
    //       var self = this;

    //       // TODO: Return the part
    //       console.log("Parallel: " + file_info.name + " Data:\n" + self.product);
    //     }
    //   });
    // });

    // /* Run the files task (a MonkeyBars.ParallelTask for each file) serially */
    // var files_task = new MonkeyBars.SequenceTask({
    //   name: 'Files Task',
    //   tasks: files_inner_tasks,
    //   onComplete: function () {
    //     // TODO: Render the dom
    //     console.log("Files Task");
    //   }
    // });
    // files_task.start();
  }

  /**
   * Setup the 'db' from the provided 'gh_mtd' and 'prjs_mtd'
   *
   * @param db Target database
   * @param gh_mtd Github metadata
   * @param cust_mtd Custom metadata
   */
  function setup_db (db, gh_mtd, cust_mtd) {
    /* Initially setup the db 'prjs' property with the github metadata */
    db.prjs = gh_mtd;

    /* Remove the disabled projects */
    if (cust_mtd.disbl) {
      cust_mtd.disbl = Object.isArray(cust_mtd.disbl) ? cust_mtd.disbl : [cust_mtd.disbl];
      rm_disbl_prjs(db, cust_mtd.disbl);
    }

    /* Setup each single project metadata */
    db.prjs.each(function(prj) {
      var has_prj_cust_mtd = function() {
        return (cust_mtd.hasOwnProperty('prjs') && cust_mtd.prjs.hasOwnProperty(prj.name));
      };
      var prj_cust_mtd = has_prj_cust_mtd() ? cust_mtd.prjs[prj.name] : undefined;

      /* 1) Shown Name */
      override_prop(prj, cust_mtd, 'repl_name_with', 'shown_name', prj.name);
      prj.shown_name = prj.shown_name.titleize();

      /* 2) Description */
      prj.desc = prj.description; delete prj.description; /* 'description' -> 'desc' */
      override_prop(prj, cust_mtd, 'repl_desc_with', 'shown_desc', prj.desc);

      /* 3) Buttons */
      prj.btns = [];
      var push_btn = function (name, link) {
        prj.btns.push({ name: name, link: link });
      };

      /* 3.1) Button - Source Code */
      push_btn('source_code', prj.svn_url);

      /* 3.2) Button - Wiki */
      if (prj['has_wiki']) {
        push_btn('wiki', prj.svn_url + "/wiki");
      }

      /* 3.2) Buttons - Custom */
      if (has_prj_cust_mtd() && prj_cust_mtd.btns) {
        prj_cust_mtd.btns = Object.isArray(prj_cust_mtd.btns) ? prj_cust_mtd.btns : [prj_cust_mtd.btns];
        prj_cust_mtd.btns.each(function (cust_btn) {
          if (cust_btn.name && cust_btn.link) {
            prj.btns.remove(function(btn) {
              return (cust_btn.name == btn.name);
            });

            push_btn(cust_btn.name, cust_btn.link);
          }
        });
      }

      /* 4) Files */
      var md_exts = [".md", ".markdown"];
      var plain_ext = "";
      var files_info = [
        { name: "README", exts: Array.create(md_exts, plain_ext) },
        { name: "CHANGELOG", exts: Array.create(md_exts, plain_ext) },
        { name: "NEWS", exts: Array.create(md_exts, plain_ext) },
        { name: "LICENSE", exts: Array.create(md_exts, plain_ext) }
      ];
      /* Create the parallel task for the files */
      create_files_task(prj.name, files_info);

      /* has_details: The current project has some details ? {Boolean} */
      prj.has_details = prj.hasOwnProperty.desc;
      prj.has_details = prj.has_details || (prj.btns.length > 0);
    });
  }

  $(document).ready(function() {
    var wrp_id = 'prjs-ctnt';
    var gh_mtd_url =
        'https://api.github.com/users/{un}/repos?'.assign({ un: 'alem0lars' });
    var cust_mtd_url = '/data/projects.json';
    var templ_url = '/projects-listing.html';
    var db = {}; /* JSON database object that feeds the template */

    $.getJSON(gh_mtd_url, function(gh_mtd) {
      $.getJSON(cust_mtd_url, function(cust_mtd) {
        /* Setup the db using the github and custom metadata */
        setup_db(db, gh_mtd, cust_mtd);
        /* Parse template from 'template_url' into 'wrapper_id' using 'db' */
        new EJS({ url: templ_url }).update(wrp_id, db);
      });
    });
  });


  /* == Projects Listing export ============================================= */

  return {};

});
