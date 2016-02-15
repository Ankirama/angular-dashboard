'use strict';

angular.module('users').factory('TokenService', TokenService);

TokenService.$inject = ['$cookies'];

function TokenService($cookies) {
  return {
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken,
    isLogged: isLogged
  };

  /**
   * get token got from /api/users/authenticate
   * @returns {token}
   */
  function getToken() { return $cookies.get('token'); }

  /**
   * set a new token
   * @param token token from /api/users/authenticate
   */
  function setToken(token) { $cookies.put('token', token); }

  function removeToken() { $cokkies.remove('token'); }

  /**
   * return true if token !== null else false
   * @returns {boolean}
   */
  function isLogged() { return $cookies.get('token') !== null; }
}
