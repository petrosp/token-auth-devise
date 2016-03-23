/* jshint node: true */
'use strict';

module.exports = {
  name: 'token-auth-devise',

  included: function (app) {
    this._super.included(app);
  }
};
