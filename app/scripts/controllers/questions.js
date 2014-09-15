'use strict';

angular.module('intquestApp')
  .controller('QuestionsCtrl', function ($scope, Questions, $location, $routeParams, $rootScope) {

    $scope.create = function() {
      var question = new Questions({
        title: this.title,
        content: this.content,
        tags: this.tags
      });
      question.$save(function(response) {
        $location.path("questions/" + response._id);
      });

      this.title = "";
      this.content = "";
      this.tags = "";
    };

    $scope.remove = function(question) {
      question.$remove();

      for (var i in $scope.questions) {
        if ($scope.questions[i] == question) {
          $scope.questions.splice(i, 1);
        }
      }
    };

    $scope.update = function() {
      var question = $scope.question;
      question.$update(function() {
        $location.path('questions/' + question._id);
      });
    };

    $scope.find = function() {
      Questions.query(function(questions) {
        $scope.questions = questions;
      });
    };

    $scope.findOne = function() {
      Questions.get({
        questionId: $routeParams.questionId
      }, function(question) {
        $scope.question = question;
      });
    };
  });
