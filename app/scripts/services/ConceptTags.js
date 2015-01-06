'use strict';

angular.module('intquestApp')
  .factory('ConceptTags', function ($resource) {
    return $resource('api/concepts/:conceptId', {
      conceptId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });
