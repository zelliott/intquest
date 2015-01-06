'use strict';

var mongoose = require('mongoose'),
    Question = mongoose.model('QuestionPost'),
    ConceptTag = mongoose.model('ConceptTag');

// var tag = new ConceptTag({
//   name: 'Security',
//   questions: [],
//   questionCount: 0
// });
//
// tag.save();

/**
* Create a concept tag
*/
exports.create = function(req, res) {
  var concepttag = new ConceptTag(req.body);

  concepttag.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(concepttag);
    }
  });
};

/**
* List of questions
*/
exports.all = function(req, res) {
  ConceptTag.find().sort('-name').exec(function(err, concepts) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(concepts);
    }
  });
};
