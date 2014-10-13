'use strict';

var mongoose = require('mongoose'),
    Question = mongoose.model('QuestionPost');

/**
 * Find question by id
 */
exports.question = function(req, res, next, id) {
  Question.load(id, function(err, question) {
    if (err) return next(err);
    if (!question) return next(new Error('Failed to load question ' + id));
    req.question = question;
    next();
  });
};

/**
 * Create a question
 */
exports.create = function(req, res) {
  var question = new Question(req.body);
  question.creator = req.user;

  question.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(question);
    }
  });
};

/**
 * Update a question
 */
exports.update = function(req, res) {
  var question = req.question;
  question.title = req.body.title;
  question.content = req.body.content;
  question.hint = req.body.hint;

  // Convert from string to array
  question.companies = req.body.companies.toString().split(",");
  question.concepts = req.body.concepts.toString().split(",");
  question.level = req.body.level;
  question.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(question);
    }
  });
};

/**
 * Delete a question
 */
exports.destroy = function(req, res) {
  var question = req.question;

  question.remove(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(question);
    }
  });
};

/**
 * Show a question
 */
exports.show = function(req, res) {
  res.json(req.question);
};

/**
 * List of questions
 */
exports.all = function(req, res) {
  Question.find().sort('-created').populate('creator', 'username').exec(function(err, questions) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(questions);
    }
  });
};
