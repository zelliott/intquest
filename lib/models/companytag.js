'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CompanyTagSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  questions: {
    type: [Schema.ObjectId],
    ref: 'QuestionPost'
  },
  questionCount: {
    type: Number
  }
});

/**
 * Define model.
 */

mongoose.model('CompanyTag', CompanyTagSchema);
