'use strict';

angular.module('intquestApp')
  .controller('UsersCtrl', function ($scope, Questions, UserQueries, Auth, $location, $routeParams, $rootScope, $http) {

      $scope.getUser = function() {
        UserQueries.getUser($routeParams.userId, function(user) {
          $scope.user = user;
        });
      };

      $scope.getQuestions = function() {
        UserQueries.getQuestions($routeParams.userId, function(questions) {
          $scope.questions = questions;
        });
      };

      $scope.getAnswers = function() {
        UserQueries.getAnswers($routeParams.userId, function(answers) {
          $scope.answers = answers;
        });
      };

      $scope.answerQuestion = {};

      $scope.findOne = function(questionId) {
        Questions.get({
          questionId: questionId
        }, function(question) {
          $scope.answerQuestion[questionId] = question;
        });
      };
  });
