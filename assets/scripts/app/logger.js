define([
  'jquery'
], function($) {


  /* == Logger export ======================================================= */

  return {
    log: function(msg, severity) {
      console.log("[" + severity + "]: " + msg);
    }
  };

});
