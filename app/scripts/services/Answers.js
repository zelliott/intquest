'use strict';

angular.module('intquestApp')
  .factory('Answers', function ($resource) {
    return $resource('api/answers/:answerId', {
      answerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });

angular.module('intquestApp')
.factory('AnswersQueries', function ($resource) {
  return {

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
