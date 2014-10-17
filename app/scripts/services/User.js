'use strict';

angular.module('intquestApp')
  .factory('User', function ($resource) {
    return $resource('/auth/users/:id/', {},
      {
        'update': {
          method:'PUT'
        }
      });
  });

angular.module('intquestApp')
.factory('UserQueries', function ($resource) {
  return {
      getQuestions: function(username, callback) {

        // Define resource
        var data = $resource('/api/users/' + username + '/questions');

        // Fire the get call
        data.query().$promise.then(function(answer){

           // Return answer in callback
           callback(answer);
        });
      },
      getAnswers: function(username, callback) {

        // Define resource
        var data = $resource('/api/users/' + username + '/answers');

        // Fire the get call
        data.query().$promise.then(function(answer){

           // Return answer in callback
           callback(answer);
        });
      }
  };
});
