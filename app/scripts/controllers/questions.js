'use strict';

angular.module('intquestApp')
  .controller('QuestionsCtrl',
  function ($scope, Questions, Answers, AnswersQueries,
            $location, $routeParams, $rootScope, $http) {

    // Capitalize helper function
    String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }

    // Creates a new question
    $scope.create = function() {

      // Save the companies & concepts as arrays
      var companies = this.companies.split(","),
          concepts = this.concepts.split(",");

      // Trim their values
      for(var i=0; i<companies.length; i++) {
        companies[i] = companies[i].trim().capitalize();
      }
      for(var i=0; i<concepts.length; i++) {
        concepts[i] = concepts[i].trim().capitalize();
      }

      // Create and save the new question
      var question = new Questions({
        title: this.title,
        content: this.content,
        hint: this.hint,
        companies: companies,
        concepts: concepts,
        level: this.level
      });
      question.$save(function() {
        $location.path('questions/');
      });

      // Wipe the values
      this.title = "";
      this.content = "";
      this.hint = "";
      this.companies = "";
      this.concepts = "";
      this.level = "";

    };

    // Remove a question
    // Note: You have to remove answers too
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

      // If companies is a string
      if($scope.question.companies.constructor != Array) {

        // Save the companies & concepts as arrays
        var companies = $scope.question.companies.split(",");

        // Trim their values
        for(var i=0; i<companies.length; i++) {
          companies[i] = companies[i].trim().capitalize();
        }
        $scope.question.companies = companies;
      }

      // If concepts is a string
      if($scope.question.concepts.constructor != Array) {

        // Save the companies & concepts as arrays
        var concepts = $scope.question.concepts.split(",");


        // Trim their values
        for(var i=0; i<concepts.length; i++) {
          concepts[i] = concepts[i].trim().capitalize();
        }
        $scope.question.concepts = concepts;
      }

      $scope.question.$update(function() {
        $location.path('questions/');
      });
    };

    // Find all of the questions
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
        $location.url("/questions");
      } else {
        $scope.openedQuestion = question._id;
        $scope.questionOpen = true;
        $location.url("/questions/?" + question._id);
      }

      if($scope.questionOpen) {
        $scope.findOne($scope.openedQuestion);
      }

      // Hide hint
      $scope.showHint = false;
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

    // Whether question is answered
    $scope.answered = false;

    $scope.findAnswers = function() {
      AnswersQueries.getAnswers($scope.openedQuestion, function(answers) {
        $scope.answers = answers;

        // Check if current user has answered the question
        for(var i=0; i<answers.length; i++) {
          if(answers[i].creator._id == $scope.currentUser._id) {
            $scope.answered = true;
          }
        }
      });
    };

    // Clicking score button

    $scope.upvote = function(question) {
      if($scope.voted == false) {
        question.score--;
      } else {
        question.score++;
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

    $scope.conceptsList = {
      Algorithms: true,
      Data: true,
      Math: true,
      Puzzles: true,
      Unix: true
    };

    $scope.conceptsAll = true;
    $scope.selectAllConcepts = function() {
      $scope.conceptsAll = !$scope.conceptsAll;
      for(var concept in $scope.conceptsList) {
         $scope.conceptsList[concept] = $scope.conceptsAll;
      }
    };

    $scope.filterByConcepts = function(question) {
      var filtered = false;
      for(var i=0; i<question.concepts.length; i++) {
        if($scope.conceptsList[question.concepts[i]] !== undefined &&
           $scope.conceptsList[question.concepts[i]]) {
          filtered = true;
        }
      }
      return filtered;
    };

    // Filtering by company

    $scope.companiesList = {
      Addepar: true,
      Apple: true,
      Google: true,
      Facebook: true,
      Microsoft: true,
      Palantir: true,
      Square: true
    };

    $scope.companiesAll = true;
    $scope.selectAllCompanies = function() {
      $scope.companiesAll = !$scope.companiesAll;
      for(var company in $scope.companiesList) {
         $scope.companiesList[company] = $scope.companiesAll;
      }
    };

    $scope.filterByCompanies = function(question) {
      var filtered = false;
      for(var i=0; i<question.companies.length; i++) {
        if($scope.companiesList[question.companies[i]] !== undefined &&
           $scope.companiesList[question.companies[i]]) {
          filtered = true;
        }
      }
      return filtered;
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
