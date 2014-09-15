'use strict';

var mongoose = require('mongoose'),
    Answer = mongoose.model('AnswerPost');

/**
 * Find answer by id
 */
exports.answer = function(req, res, next, id) {
  Answer.load(id, function(err, answer) {
    if (err) return next(err);
    if (!answer) return next(new Error('Failed to load answer ' + id));
    req.answer = answer;
    next();
  });
};

/**
 * Create an answer
 */
exports.create = function(req, res) {
  var answer = new Answer(req.body);
  answer.creator = req.user;

  answer.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(answer);
    }
  });
};

/**
 * Update a answer
 */
exports.update = function(req, res) {
  var answer = req.answer;
  answer.title = req.body.title;
  answer.content = req.body.content;
  answer.tags = req.body.tags;
  answer.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(answer);
    }
  });
};

/**
 * Delete a answer
 */
exports.destroy = function(req, res) {
  var answer = req.answer;

  answer.remove(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(answer);
    }
  });
};

/**
 * Show a answer
 */
exports.show = function(req, res) {
  res.json(req.answer);
};

/**
 * List of answers
 */
exports.all = function(req, res) {
  Answer.find().sort('-created').populate('creator', 'username').exec(function(err, answers) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(answers);
    }
  });
};
