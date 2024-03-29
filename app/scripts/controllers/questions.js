'use strict';

angular.module('intquestApp')
  .controller('QuestionsCtrl',
  function ($scope, Questions, Answers, AnswersQueries, ConceptTags,
            $location, $routeParams, $rootScope, $http, User, $cookieStore) {

    // Capitalize helper function
    String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }

    // Creates a new question
    $scope.create = function() {

      // Save the companies & concepts as arrays
      // var companies = this.companies.split(",");
      //
      // Trim their values
      // for(var i=0; i<companies.length; i++) {
      //   companies[i] = companies[i].trim().capitalize();
      // }

      // Create and save the new question
      var question = new Questions({
        title: this.title,
        content: this.content,
        hint: this.hint,
        // companies: companies,
        concepts: $scope.concepts,
        level: this.level
      });
      question.$save(function() {
        $location.path('questions/');
      });

      // Wipe the values
      this.title = "";
      this.content = "";
      this.hint = "";
      // this.companies = "";
      this.concepts = "";
      this.level = "";

    };

    // Remove a question
    // Note: You have to remove answers too
    $scope.remove = function(question) {

      AnswersQueries.getAnswers(question, function(answers) {
        $scope.answers = answers;
        for(var i=0; i<answers.length; i++) {
          answers[i].$remove();
        }
      });

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

      $scope.question.$update(function() {
        $location.path('questions/');
      });
    };

    $scope.questions = [];

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
        $location.url("/questions/");
      } else {
        $scope.openedQuestion = question._id;
        $scope.questionOpen = true;
        $location.url("/questions/?" + question._id);
        $scope.checkUnderstood(question._id);
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
      $scope.checkUnderstood(questionId);
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
        $scope.answered = false;
        for(var i=0; i<answers.length; i++) {
          if($scope.currentUser != null &&
             answers[i].creator._id == $scope.currentUser._id) {
            $scope.answered = true;
          }
        }
      });
    };

    $scope.counts = {};
    $scope.countAnswers = function(questionid) {
      AnswersQueries.getAnswers(questionid, function(answers) {
        //if(answers.length == 0) {
          //$scope.counts[questionid] = "";
        //} else {
          $scope.counts[questionid] = answers.length;
        //}
      });
    };

    // Mark question as understood
    $scope.understood = function(questionid) {
      var user = $scope.currentUser;
      if(user.marked.indexOf(questionid) == -1) {
        user.marked.push(questionid);
        $scope.marked = true;
      } else {
        user.marked.splice(user.marked.indexOf(questionid), 1);
        $scope.marked = false;
      }
      User.update(user);
    };

    $scope.checkUnderstood = function(questionid) {
      if($scope.currentUser != null) {
        if($scope.currentUser.marked.indexOf(questionid) != -1) {
          $scope.marked = true;
        } else {
          $scope.marked = false;
        }
      }
    }

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
      { option: 'Easy First', attr: 'level', rev: false },
      { option: 'Hard First', attr: 'level', rev: true },
      { option: 'Recent', attr: 'created', rev: true },
      { option: 'Oldest', attr: 'created', rev: false },
      //{ option: 'Popular', attr: 'score' },
      //{ option: 'Hot', attr: ''}
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
    { option: 'by title', attr: 'title' },
// { option: 'by company', attr: 'companies' },
    { option: 'by concept', attr: 'concepts' },
    { option: 'by author', attr: 'creator' }
    ];

    $scope.selectedSearchParam = $scope.searchParams[0];

    $scope.search = {};

    // Filtering by concept

    $scope.initConcepts = function() {

      $scope.conceptNames = [];

      ConceptTags.query(function(concepttags) {

        // Build conceptsList cookie if it doesn't exist
        if($cookieStore.get('conceptsList') === undefined) {
          var tempList = {};
          for(var j=0; j<concepttags.length; j++) {
            tempList[concepttags[j].name] = true;
          }
          $cookieStore.put('conceptsList', tempList);
        }

        // Set conceptsList to the saved cookie
        $scope.conceptsList = $cookieStore.get('conceptsList');

        for(var i=0; i<concepttags.length; i++) {
          if(typeof concepttags[i] !== undefined) {
            $scope.conceptNames.unshift(concepttags[i].name);
          }
        }
      });
    };

    $scope.$watch('conceptsList', function() {
      if($scope.conceptsList !== undefined) {
        $cookieStore.put('conceptsList', $scope.conceptsList);
      }
    }, true);

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
        if($scope.conceptsList !== undefined) {
          if($scope.conceptsList[question.concepts[i]] !== undefined &&
             $scope.conceptsList[question.concepts[i]]) {
            filtered = true;
          }
        }
      }
      return filtered;
    };

    $scope.countQuestions = function(concept) {
      var count = 0;
      for(var i=0; i<$scope.questions.length; i++) {
        for(var j=0; j<$scope.questions[i].concepts.length; j++) {
          if($scope.questions[i].concepts[j] == concept) {
            count++;
          }
        }
      }
      return count;
    }

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

    // Filtered by marked
    $scope.filterByMarked = function(question) {

      if($scope.markedFilter == true) {
        return ($scope.currentUser.marked.indexOf(question._id) == -1);
      } else {
        return true;
      }
    };

    $scope.showMarked = function(question) {
      return ($scope.currentUser.marked.indexOf(question._id) != -1);

    };

    // Filtered by answered
    $scope.filterByAnswered = function(question) {

      if($scope.answeredFilter == true) {
        return ($scope.counts[question._id] != 0);
      } else {
        return true;
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

      this.content = "";
    };

    $scope.editedAnswers = {};

    $scope.toggleEditAnswer = function(answer) {
      $scope.editedAnswers[answer._id] = !$scope.editedAnswers[answer._id];
      $scope.answerEdited = answer;
    };

    $scope.updateAnswer = function() {
      Answers.update($scope.answerEdited);
    };

    $scope.showAnswers = false;

    $scope.toggleAnswers = function() {
      $scope.showAnswers = !$scope.showAnswers;
    };

    $scope.showHint = false;

    $scope.toggleHint = function() {
      $scope.showHint = !$scope.showHint;
    }

    // Remove an answer
    $scope.removeAnswer = function(answer) {
      Answers.remove({answerId: answer._id});

      for (var i in $scope.answers) {
        if ($scope.answers[i] == answer) {
          $scope.answers.splice(i, 1);
        }
      }
    };
});
