'use strict';

angular.module('intquestApp')
  .controller('QuestionsCtrl', function ($scope, Questions, $location, $routeParams, $rootScope, $http) {

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

    // Boolean: Tests if question is open?
    $scope.openQuestion = $location.$$path.slice(11) != '';

    $scope.findOne = function() {
      if($scope.openQuestion) {
        Questions.get({
          questionId: $routeParams.questionId
        }, function(question) {
          $scope.question = question;
        });
      }
    };

    // Clicking score button
    $scope.scoreClicked = function(score) {

      // Test if user has already clicked

      // Update DB

      // Update view
      return score = score + 1;
    };
  });
