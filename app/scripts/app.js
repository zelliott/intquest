'use strict';

angular.module('intquestApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'http-auth-interceptor',
  'ui.bootstrap',
  'btford.markdown',
  'infinite-scroll',
  // 'angularUtils.directives.dirPagination',
  'localytics.directives',
  'ngCookies'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/questions/list.html',
        controller: 'QuestionsCtrl'
      })
      .when('/questions/create', {
        templateUrl: 'partials/questions/add.html',
        controller: 'QuestionsCtrl'
      })
      .when('/questions/edit/:questionId?', {
        templateUrl: 'partials/questions/edit.html',
        controller: 'QuestionsCtrl'
      })
      .when('/questions/:questionId?', {
        templateUrl: 'partials/questions/list.html',
        controller: 'QuestionsCtrl',
        reloadOnSearch: false
      })
      .when('/users/:userId', {
        templateUrl: 'partials/user.html',
        controller: 'UsersCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/faq', {
        templateUrl: 'partials/faq.html',
        controller: 'QuestionsCtrl'
      })
      .when('/resources', {
        templateUrl: 'partials/resources.html',
        controller: 'QuestionsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  })

  .run(function ($rootScope, $location, Auth) {

    //watching the value of the currentUser variable.
    $rootScope.$watch('currentUser', function(currentUser) {
      // if no currentUser and on a page that requires authorization then try to update it
      // will trigger 401s if user does not have a valid session
      if (!currentUser && (['/', '/login', '/logout', '/signup'].indexOf($location.path()) == -1 )) {
        Auth.currentUser();
      }
    });

    // On catching 401 errors, redirect to the login page.
    $rootScope.$on('event:auth-loginRequired', function() {
      $location.path('/questions/');
      return false;
    });
  });
