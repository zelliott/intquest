'use strict';

angular.module('intquestApp')
.factory('Answers', function ($resource) {
  return {
      getAnswer: function(callback) {

        var data = $resource('api/answers/:answerId', {
          answerId: '@_id'
        }, {
          update: {
            method: 'PUT'
          }
        });

        // Fire the get call
        data.query().$promise.then(function(answer){

           // Return answer in callback
           callback(answer);
        });

      },

      getAnswers: function(questionId, callback) {

        // Define resource
        var data = $resource('api/answers?questionid=' + questionId);

        // Fire the get call
        data.query().$promise.then(function(answer){

           // Return answer in callback
           callback(answer);
        });
      }
  };
});
