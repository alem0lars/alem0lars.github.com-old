define([
  'jquery'
], function($) {


  /* == Logger export ======================================================= */

  return {
    /**
     * Log in the console the provided message 'msg' with the severity 'sev'
     *
     * @param msg The message to be logged
     * @param sev The severity (e.g. Error, Info, Warning)
     * @return {String} The logged message string
     */
    log: function(msg, sev) {
      var out = "[" + sev + "]: " + msg;
      console.log(out);
      return out;
    }
  };

});
