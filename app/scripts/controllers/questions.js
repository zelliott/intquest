'use strict';

angular.module('intquestApp')
  .controller('QuestionsCtrl', function ($scope, Questions, Answers, AnswersQueries, $location, $routeParams, $rootScope, $http) {

    $scope.create = function() {
      var question = new Questions({
        title: this.title,
        content: this.content,
        hint: this.hint,
        companies: this.companies.split(","),
        concepts: this.concepts.split(","),
        level: this.level
      });
      question.$save(function() {
        $location.path('questions/');
      });

      this.title = "";
      this.content = "";
      this.hint = "";
      this.companies = "";
      this.concepts = "";
      this.level = "";

    };

    // Make this work slightly better
    // Plus you have to remove answers too
    $scope.remove = function(question) {
      $scope.toggleOpenQuestion(question);
      question.$remove();

      for (var i in $scope.questions) {
        if ($scope.questions[i] == question) {
          $scope.questions.splice(i, 1);
        }
      }
      $location.path('questions/');
    };

    $scope.update = function() {
      var question = $scope.question;
      question.$update(function() {
        $location.path('questions/');
      });
    };

    $scope.find = function() {
      Questions.query(function(questions) {
        $scope.questions = questions;
      });
    };

    $scope.questionUrl = $location.$$url.slice(12);

    $scope.openedQuestion = $scope.questionUrl;
    $scope.questionOpen = ($scope.questionUrl == '') ? false : true;

    $scope.toggleOpenQuestion = function(question) {
      if(question._id == $scope.openedQuestion) {
        $scope.openedQuestion = '';
        $scope.questionOpen = false;
      } else {
        $scope.openedQuestion = question._id;
        $scope.questionOpen = true;
      }

      if($scope.questionOpen) {
        $scope.findOne($scope.openedQuestion);
      }
    };

    $scope.findOne = function(questionId) {
      if(questionId == null) {
        questionId = $location.$$url.slice(17);
      }
      Questions.get({
        questionId: questionId
      }, function(question) {
        $scope.question = question;
      });
      $scope.findAnswers();
    };

    $scope.findAnswers = function() {
      AnswersQueries.getAnswers($scope.openedQuestion, function(answers) {
        $scope.answers = answers;
      });
    };

    // Clicking score button

    $scope.upvote = function(question) {
      if($scope.voted == false) {
        question.score--;
        console.log(question);
      } else {
        question.score++;
        console.log(question);
      }
    };

    // Ordering questions

    $scope.orders = [
      { option: 'All', attr: '' },
      { option: 'Recent', attr: 'created' },
      { option: 'Popular', attr: 'score' },
      { option: 'Hot', attr: ''}
    ];

    $scope.selectedOrder = $scope.orders[0];

    $scope.updateOrder = function() {

      // If selected order = recent, change timeframe to today
      if($scope.selectedOrder == $scope.orders[0]) {
        $scope.selectedTimeframe = $scope.timeframes[4];
      } else if($scope.selectedOrder == $scope.orders[1]) {
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

    $scope.selectedTimeframe = $scope.timeframes[4];

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

    // Filtering by concept

    $scope.concepts = {
      Math: true,
      Puzzles: true
    };

    $scope.conceptsAll = true;
    $scope.selectAllConcepts = function() {
      $scope.conceptsAll = !$scope.conceptsAll;
      for(var concept in $scope.concepts) {
         $scope.concepts[concept] = $scope.conceptsAll;
      }
    };

    $scope.filterByConcepts = function(question) {

      for(var i=0; i<question.concepts.length; i++) {
        if($scope.concepts[question.concepts[i]]) {
          return $scope.concepts[question.concepts[i]];
        } else {
          return false;
        }
      }
    };

    // Filtering by company

    $scope.companies = {
      Addepar: true,
      Palantir: true
    };

    $scope.companiesAll = true;
    $scope.selectAllCompanies = function() {
      $scope.companiesAll = !$scope.companiesAll;
      for(var company in $scope.companies) {
         $scope.companies[company] = $scope.companiesAll;
      }
    };


    $scope.filterByCompanies = function(question) {
      for(var i=0; i<question.companies.length; i++) {
        if($scope.companies[question.companies[i]]) {
          return $scope.companies[question.companies[i]];
        } else {
          return false;
        }
      }
    };

    // Answers Ctrl

    $scope.answer = function() {
      var answer = new Answers({
        content: this.content,
        questionid: $scope.openedQuestion
      });

      answer.$save(function(response) {
        $scope.findAnswers();
      });
    };

    $scope.editedAnswers = {};

    $scope.toggleEditAnswer = function(answer) {
      $scope.editedAnswers[answer._id] = !$scope.editedAnswers[answer._id];
      $scope.answerEdited = answer;
    };

    $scope.updateAnswer = function() {
      Answers.update($scope.answerEdited);
    };

    $scope.showAnswers = true;

    $scope.toggleAnswers = function() {
      $scope.showAnswers = !$scope.showAnswers;
    };

    $scope.showHint = false;

    $scope.toggleHint = function() {
      $scope.showHint = !$scope.showHint;
    }
  });
