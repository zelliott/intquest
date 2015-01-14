'use strict';

angular.module('intquestApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:userId/', {
      userId: '@_id'
    }, {
      update: {
        method:'PUT'
      }
    });
  });

  angular.module('intquestApp')
  .factory('UserAuth', function ($resource) {
    return $resource('/auth/users/:userId/', {}, {
      update: {
        method:'PUT'
      }
    });
  });

angular.module('intquestApp')
.factory('UserQueries', function ($resource) {
  return {
      getUser: function(userId, callback) {

        // Define resource
        var data = $resource('/api/users/' + userId);

        // Fire the get call
        data.get().$promise.then(function(user){

           // Return answer in callback
           callback(user);
        });
      },
      getQuestions: function(userId, callback) {

        // Define resource
        var data = $resource('/api/users/' + userId + '/questions');

        // Fire the get call
        data.query().$promise.then(function(answer){

           // Return answer in callback
           callback(answer);
        });
      },
      getAnswers: function(userId, callback) {

        // Define resource
        var data = $resource('/api/users/' + userId + '/answers');

        // Fire the get call
        data.query().$promise.then(function(answer){

           // Return answer in callback
           callback(answer);
        });
      }
  };
});
