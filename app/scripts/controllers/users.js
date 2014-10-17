'use strict';

angular.module('intquestApp')
  .controller('UsersCtrl', function ($scope, UserQueries, Auth, $location, $routeParams, $rootScope, $http) {

      $scope.getQuestions = function() {
        UserQueries.getQuestions($routeParams.username, function(questions) {
          $scope.questions = questions;
        });
      };

      $scope.getAnswers = function() {
        UserQueries.getAnswers($routeParams.username, function(answers) {
          $scope.answers = answers;
        });
      };
  });
