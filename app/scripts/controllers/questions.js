'use strict';

angular.module('intquestApp')
  .controller('questionsCtrl', function ($scope, questions, $location, $routeParams, $rootScope) {

    $scope.create = function() {
      var question = new questions({
        title: this.title,
        content: this.content
      });
      question.$save(function(response) {
        $location.path("questions/" + response._id);
      });

      this.title = "";
      this.content = "";
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
      questions.query(function(questions) {
        $scope.questions = questions;
      });
    };

    $scope.findOne = function() {
      questions.get({
        questionId: $routeParams.questionId
      }, function(question) {
        $scope.question = question;
      });
    };
  });
