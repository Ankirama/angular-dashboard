'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider.
        state('home', {
          url: '/',
          templateUrl: 'modules/users/views/dashboard.client.view.html',
          controller: 'DashboardController',
          controllerAs: 'vm',
          title: 'OBD Project | Home'
        }).
          state('map', {
          url: '/map',
          templateUrl: 'modules/core/views/map.client.view.html',
          controller: 'MapController',
          controllerAs: 'vm',
          title: 'OBD Project | Map'
        }).
          state('charts', {
          url: '/charts',
          templateUrl: 'modules/core/views/charts.client.view.html',
          controller: 'ChartsController',
          controllerAs: 'vm',
          title: 'OBD Project | Charts'
        }).
          state('infos', {
          url: '/infos',
          templateUrl: 'modules/core/views/infos.client.view.html',
          controller: 'InfosController',
          controllerAs: 'vm',
          title: 'OBD Project | Infos'
        });
        // use the HTML5 History API
         $locationProvider.html5Mode(true);
    }
]);
