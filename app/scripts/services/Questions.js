'use strict';

angular.module('intquestApp')
  .factory('Questions', function ($resource) {
    return $resource('api/questions/:questionId', {
      questionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });
