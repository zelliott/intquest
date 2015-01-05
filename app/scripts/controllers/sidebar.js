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


// Fixed sidebar function
// $(window).on('scroll', function() {
//   positionSidebar(window.pageYOffset);
//   console.log('hi');
// });
//
// function positionSidebar(y) {
//   if(y >= 64) {
//     $('.sidebar').addClass('fixed');
//   } else {
//     $('.sidebar').removeClass('fixed');
//   }
// }
