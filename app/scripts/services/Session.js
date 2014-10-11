'use strict';

angular.module('intquestApp')
  .factory('Session', function ($resource) {
    return $resource('/auth/session/');
  });
