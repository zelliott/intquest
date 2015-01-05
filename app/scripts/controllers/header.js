'use strict';

angular.module('intquestApp')
  .controller('HeaderCtrl', function ($scope, Auth, $location) {
    $scope.menu = [{
      "title": "All questions",
      "link": "questions"
    }];

    // $scope.authMenu = [{
    //   "title": "Add question",
    //   "link": "questions/create"
    // }];

    $scope.logout = function() {
      Auth.logout(function(err) {
        if(!err) {
          $location.path('/login');
        }
      });
    };
  });
