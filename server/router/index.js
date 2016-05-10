(function() {
  'use strict';
  // Get the routes
  var publicRoutes = require('./routes/public'),
   usersRoutes = require('./routes/users'),
   rolesRoutes = require('./routes/roles'),
   categoriesRoutes = require('./routes/categories'),
   documentsRoutes = require('./routes/documents');

  // Authentication Middleware
  var authenticate = require('../controllers/authenticate');

  module.exports = function(app) {
    // Accessible without being logged in
    app.use('/', publicRoutes);

    // Protect sensitive routes
    app.use(authenticate.token);
    app.use('/users', usersRoutes);
    app.use('/roles', rolesRoutes);
    app.use('/categories', categoriesRoutes);
    app.use('/documents', documentsRoutes);
  };
})();
