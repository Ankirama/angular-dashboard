'use strict';

angular.module('core').config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push(['$q', '$location', 'TokenService', '$injector', function($q, $location, TokenService, injector) {
    var configService = {
      request: function (config) {
        if (config.url.substring(0, 5) == "/api/") {
          if (TokenService.isLogged()) {
            config.headers['Authorization'] = "Bearer " + TokenService.getToken();
          } else {
          }
        }
        return config;
      },
      responseError: function (rejection) {
        switch (rejection.status) {
          case 401: //unautorized user
            $location.path('/login');
            break;
          case 403: //forbidden user
            break;
        }
        return $q.reject(rejection);
      }
    };
    return configService;
  }]);
}]);
