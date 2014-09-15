'use strict';

angular.module('intquestApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'http-auth-interceptor',
  'ui.bootstrap'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/splash.html',
        controller: 'SplashCtrl'
      })
      .when('/questions', {
        templateUrl: 'partials/questions/list.html',
        controller: 'questionsCtrl'
      })
      .when('/questions/create', {
        templateUrl: 'partials/questions/add.html',
        controller: 'questionsCtrl'
      })
      .when('/questions/:questionId/edit', {
        templateUrl: 'partials/questions/edit.html',
        controller: 'questionsCtrl'
      })
      .when('/questions/:questionId', {
        templateUrl: 'partials/questions/view.html',
        controller: 'questionsCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl'
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
      $location.path('/login');
      return false;
    });
  });
