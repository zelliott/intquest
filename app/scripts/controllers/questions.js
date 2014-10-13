'use strict';

angular.module('intquestApp')
  .controller('QuestionsCtrl', function ($scope, Questions, Answers, AnswersQueries, $location, $routeParams, $rootScope, $http) {

    $scope.create = function() {
      var question = new Questions({
        title: this.title,
        content: this.content,
        companies: this.companies.split(","),
        concepts: this.concepts.split(","),
        level: this.level
      });
      question.$save(function(response) {
        $location.path("questions/" + response._id);
      });

      this.title = "";
      this.content = "";
      this.companies = "";
      this.concepts = "";
      this.level = "";

    };

    $scope.answer = function() {
      var answer = new Answers({
        content: this.content,
        questionid: $routeParams.questionId
      });

      answer.$save(function(response) {
        $location.path("questions/" + $routeParams.questionId);
        $scope.findAnswers();
      });
    }

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

    // Boolean: Tests if question is open
    $scope.openQuestion = $location.$$path.slice(11) != '';

    $scope.findOne = function() {
      if($scope.openQuestion) {
        Questions.get({
          questionId: $routeParams.questionId
        }, function(question) {
          $scope.question = question;
        });
      }

      $scope.findAnswers();
    };

    $scope.findAnswers = function() {
      AnswersQueries.getAnswers($routeParams.questionId, function(answers) {
        $scope.answers = answers;
      });
    };

    // Clicking score button
    $scope.upvote = function(question) {
      if($scope.voted) {
        question.score--;
        $scope.voted = false;
      } else {
        question.score++;
        $scope.voted = true;
      }
    };

    // Ordering questions

    $scope.orders = [
      { option: 'Recent', attr: 'created' },
      { option: 'Popular', attr: 'score' },
      { option: 'Hot', attr: ''}
    ];

    $scope.selectedOrder = $scope.orders[0];

    $scope.updateOrder = function() {

      // If selected order = recent, change timeframe to today
      if($scope.selectedOrder == $scope.orders[0]) {
        $scope.selectedTimeframe = $scope.timeframes[0];
      }
    };

    // Timeframe logic
    $scope.timeframes = [
      { option: 'Today', logic: 'day' },
      { option: 'Week', logic: 'month' },
      { option: 'Month', logic: 'month' },
      { option: 'Year', logic: 'year' },
      { option: 'All time', logic: '' }
    ];

    $scope.selectedTimeframe = $scope.timeframes[0];

    $scope.isWithinTimeframe = function(question) {
      if($scope.selectedTimeframe.logic != '') {
        return question.created > moment().subtract(1, $scope.selectedTimeframe.logic).toISOString();
      } else {
        return true;
      }
    };

    // Searching questions

    $scope.searchParams = [
      { option: 'Title', attr: 'title' },
      { option: 'Company', attr: 'companies' },
      { option: 'Concept', attr: 'concepts' },
      { option: 'Author', attr: 'creator' }
    ];

    $scope.selectedSearchParam = $scope.searchParams[0];

    $scope.search = {};

    // Answers controllers
    $scope.showAnswers = true;

    $scope.toggleAnswers = function() {
      $scope.showAnswers = !$scope.showAnswers;
    };
  });
