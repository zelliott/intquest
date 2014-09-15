'use strict';

var path = require('path'),
    auth = require('../config/auth');

module.exports = function(app) {
  // User Routes
  var users = require('../controllers/users');
  app.post('/auth/users', users.create);
  app.get('/auth/users/:userId', users.show);

  // Check if username is available
  // todo: probably should be a query on users
  app.get('/auth/check_username/:username', users.exists);

  // Session Routes
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.del('/auth/session', session.logout);

  // question Routes
  var questions = require('../controllers/questions');
  app.get('/api/questions', questions.all);
  app.post('/api/questions', auth.ensureAuthenticated, questions.create);
  app.get('/api/questions/:questionId', questions.show);
  app.put('/api/questions/:questionId', auth.ensureAuthenticated, auth.question.hasAuthorization, questions.update);
  app.del('/api/questions/:questionId', auth.ensureAuthenticated, auth.question.hasAuthorization, questions.destroy);

  //Setting up the questionId param
  app.param('questionId', questions.question);

  // Angular Routes
  app.get('/partials/*', function(req, res) {
    var requestedView = path.join('./', req.url);
    res.render(requestedView);
  });

  app.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }

    res.render('index.html');
  });

}