'use strict';

var mongoose = require('mongoose'),
    Question = mongoose.model('QuestionPost'),
    ConceptTag = mongoose.model('ConceptTag');

// var a = new ConceptTag({
//   name: 'Algorithms',
//   questions: [],
//   questionCount: 0
// });
// var b = new ConceptTag({
//   name: 'Arrays',
//   questions: [],
//   questionCount: 0
// });
// var c = new ConceptTag({
//   name: 'Data',
//   questions: [],
//   questionCount: 0
// });
// var d = new ConceptTag({
//   name: 'Graphs',
//   questions: [],
//   questionCount: 0
// });
// var e = new ConceptTag({
//   name: 'Security',
//   questions: [],
//   questionCount: 0
// });
// var f = new ConceptTag({
//   name: 'Math',
//   questions: [],
//   questionCount: 0
// });
// var g = new ConceptTag({
//   name: 'Puzzles',
//   questions: [],
//   questionCount: 0
// });
// var h = new ConceptTag({
//   name: 'Security',
//   questions: [],
//   questionCount: 0
// });
// var i = new ConceptTag({
//   name: 'Strings',
//   questions: [],
//   questionCount: 0
// });
// var j = new ConceptTag({
//   name: 'System Design',
//   questions: [],
//   questionCount: 0
// });
// var k = new ConceptTag({
//   name: 'Testing',
//   questions: [],
//   questionCount: 0
// });
// var l = new ConceptTag({
//   name: 'Recursion',
//   questions: [],
//   questionCount: 0
// });
// var m = new ConceptTag({
//   name: 'Trees',
//   questions: [],
//   questionCount: 0
// });
//
// a.save();
// b.save();
// c.save();
// d.save();
// e.save();
// f.save();
// g.save();
// h.save();
// i.save();
// j.save();
// k.save();
// l.save();
// m.save();

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
