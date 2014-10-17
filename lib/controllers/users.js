'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  ObjectId = mongoose.Types.ObjectId,
  Question = mongoose.model('QuestionPost'),
  Answer = mongoose.model('AnswerPost');

/**
 * Create user
 * requires: {username, password, email}
 * returns: {email, password}
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';

  newUser.save(function(err) {
    if (err) {
      return res.json(400, err);
    }

    req.logIn(newUser, function(err) {
      if (err) return next(err);
      return res.json(newUser.user_info);
    });
  });
};

/**
 *  Show profile
 *  returns {username, profile}
 */
exports.show = function (req, res, next) {
  var userId = req.params.userId;

  User.findById(ObjectId(userId), function (err, user) {
    if (err) {
      return next(new Error('Failed to load User'));
    }
    if (user) {
      res.send({username: user.username, profile: user.profile });
    } else {
      res.send(404, 'USER_NOT_FOUND')
    }
  });
};

exports.questions = function (req, res, next) {
  var username = req.params.username;

  User.findOne({ username : username }, function (err, user) {
    if (err) {
      return next(new Error('Failed to load User ' + username));
    }

    if(user) {

      Question.find().populate('creator', 'username').where('creator').equals(user._id).exec(function (err, questions) {
        if (err) {
          res.json(500, err);
        } else {
          res.json(questions);
        }
      });

    } else {
      res.json({exists: false});
    }
  });
};

exports.answers = function (req, res, next) {
  var username = req.params.username;

  User.findOne({ username : username }, function (err, user) {
    if (err) {
      return next(new Error('Failed to load User ' + username));
    }

    if(user) {

      Answer.find().populate('creator', 'username').where('creator').equals(user._id).exec(function (err, answers) {
        if (err) {
          res.json(500, err);
        } else {
          res.json(answers);
        }
      });

    } else {
      res.json({exists: false});
    }
  });
};

/**
 * List of users
 */
// exports.all = function(req, res) {
//   User.find().sort('-created').exec(function(err, questions) {
//     if (err) {
//       res.json(500, err);
//     } else {
//       res.json(questions);
//     }
//   });
// };

/**
 *  Username exists
 *  returns {exists}
 */
exports.exists = function (req, res, next) {
  var username = req.params.username;
  User.findOne({ username : username }, function (err, user) {
    if (err) {
      return next(new Error('Failed to load User ' + username));
    }

    if(user) {
      res.json({exists: true});
    } else {
      res.json({exists: false});
    }
  });
}
