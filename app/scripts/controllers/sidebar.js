// 'use strict';
//
// angular.module('intquestApp')
//   .controller('SidebarCtrl', function ($scope, Questions, Answers, AnswersQueries, $location, $routeParams, $rootScope, $http) {
//
//     // Filtering by concept
//
//     $scope.concepts = {
//       All: true,
//       Math: false,
//       Puzzles: false
//     };
//
//     $scope.filterByConcepts = function(question) {
//       if($scope.concepts.All == true) {
//         return true;
//       }
//
//       for(var i=0; i<question.concepts.length; i++) {
//         if($scope.concepts[question.concepts[i]]) {
//           return $scope.concepts[question.concepts[i]];
//         } else {
//           return false;
//         }
//       }
//     };
//   });
