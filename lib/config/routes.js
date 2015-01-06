'use strict';

var path = require('path'),
    auth = require('../config/auth');

module.exports = function(app) {
  // User Routes
  var users = require('../controllers/users');
  app.post('/auth/users', users.create);
  app.get('/auth/users/:userId', users.show);
  // app.get('/api/users', users.all);

  app.get('/api/users/:userId', users.show);
  app.get('/api/users/:userId/questions', users.questions);
  app.get('/api/users/:userId/answers', users.answers);
  app.put('/api/users/:userId', users.update);

  // Check if username is available
  // todo: probably should be a query on users
  app.get('/auth/check_username/:username', users.exists);

  // Session Routes
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.del('/auth/session', session.logout);

  // Question Routes
  var questions = require('../controllers/questions');
  app.get('/api/questions', questions.all);
  app.post('/api/questions', auth.ensureAuthenticated, questions.create);
  app.get('/api/questions/:questionId', questions.show);
  app.put('/api/questions/:questionId', auth.ensureAuthenticated, auth.question.hasAuthorization, questions.update);
  app.del('/api/questions/:questionId', auth.ensureAuthenticated, auth.question.hasAuthorization, questions.destroy);

  // Answer Routes
  var answers = require('../controllers/answers');
  app.get('/api/answers', answers.all);
  app.post('/api/answers', auth.ensureAuthenticated, answers.create);
  app.get('/api/answers/:answerId', answers.show);
  app.put('/api/answers/:answerId', auth.ensureAuthenticated, auth.answer.hasAuthorization, answers.update);
  app.del('/api/answers/:answerId', auth.ensureAuthenticated, auth.answer.hasAuthorization, answers.destroy);

  // ConceptTag Routes
  var concepttags = require('../controllers/concepttags');
  app.get('/api/concepts', concepttags.all);
  app.post('/api/concepts', auth.ensureAuthenticated, concepttags.create);

  //Setting up the questionId param
  app.param('questionId', questions.question);

  //Setting up the answerId param
  app.param('answerId', answers.answer);

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
