'use strict';

angular.module('intquestApp')
  .factory('questions', function ($resource) {
    return $resource('api/questions/:questionId', {
      questionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });
