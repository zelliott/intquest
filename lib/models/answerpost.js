'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AnswerPostSchema = new Schema({
  questionslug: String,
  content: {
    type: String,
    default: '',
    trim: true
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true
  },
  created: Date,
  updated: [Date],
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  score: {
    type: Number,
    default: 0
  }
});

/**
 * Pre hook.
 */

AnswerPostSchema.pre('save', function(next, done){
  if (this.isNew)
    this.created = Date.now();

  this.updated.push(Date.now());

  next();
});

/**
 * Statics
 */
AnswerPostSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('creator', 'username').exec(cb);
  }
};

/**
 * Methods
 */

// QuestionPostSchema.statics.findByTitle = function (title, callback) {
//   return this.find({ title: title }, callback);
// }
//
// QuestionPostSchema.methods.expressiveQuery = function (creator, date, callback) {
//   return this.find('creator', creator).where('date').gte(date).run(callback);
// }

/**
 * Plugins
 */

function slugGenerator (options){
  options = options || {};
  var key = options.key || 'title';

  return function slugGenerator(schema){
    schema.path(key).set(function(v){
      this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/-+/g, '');
      return v;
    });
  };
};

AnswerPostSchema.plugin(slugGenerator());

/**
 * Define model.
 */

mongoose.model('AnswerPost', AnswerPostSchema);
