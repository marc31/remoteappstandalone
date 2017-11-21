'use strict';

module.exports = function (app) {

  const remoteApp = require('../controllers/remonteApp.controllers');

  // Users list
  app.route('/api/remoteApp/:toDo')
     .get( remoteApp.toDo );

};

