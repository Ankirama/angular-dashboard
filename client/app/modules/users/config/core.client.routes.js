'use strict';

// Setting up routes
angular.module('users').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');

    // Home state routing
    $stateProvider.
    state('login', {
      url: '/login',
      templateUrl: 'modules/users/views/login.client.view.html',
      controller: 'LoginController',
      controllerAs: 'vm',
      title: 'OBD Project | Login'
    });
  }
]);
