/**
 * Service to config core.client.config.js
 * It will add token into each header if user is logged
 * It will redirect if any error (401 error)
 */

'use strict';

angular.module('core').factory('ConfigService', ConfigService);


ConfigService.$inject = ['$q', '$location', 'ProfileService', '$injector'];

function ConfigService($q, $location, ProfileService, injector) {
  var configService = {
    request: function(config) {
      console.log('sessionInjector');
      if (ProfileService.isLogged()) {
        console.log('logged');
        config.headers['Autorization'] = "Bearer " + ProfileService.getToken();
      } else {
        console.log('not logged');
        console.log(ProfileService.getToken());
      }
      return config;
    },
    responseError: function(rejection) {
      console.log('responseError');
      console.log(rejection.status);
      switch(rejection.status) {
        case 401: //unautorized user
          console.log('case 401');
          $location.path('/login');
          break;
        case 403: //forbidden user
          break;
      }
      return $q.reject(rejection);
    }
  };
  return configService;
}
