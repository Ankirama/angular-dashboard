/**
 * Controller to authenticate a user.
 */

'use strict';

angular.module('core').controller('LoginController', LoginController);

LoginController.$inject = ['ProfileService', 'TokenService', '$cookies', '$location'];

function LoginController(ProfileService, TokenService, $cookies, $location) {
  var vm = this;

  // variables
  vm.username = '';
  vm.error    = null;
  vm.img      = "http://freemakeblogpool.freemake.netdna-cdn.com/wp-content/uploads/2012/06/Video-to-GIF.gif";

  // functions
  vm.login = login;

  /**
   * Redirect if user already logged
   */
  if ($cookies.authentication == 1) { $location.path('/'); }

  function login() {
      return ProfileService.login(vm.username, vm.password)
          .then(function(response) {
            console.log(response);
            $cookies.put('authentication', 1);
            TokenService.setToken(response.data.token);
            $location.path('/');
          })
          .catch(function(err) {
            console.log('error here');
            console.log(err);
            $cookies.remove('authentication');
            TokenService.removeToken();
            vm.error = err.error;
            //return vm.error;
          });
  }
}
