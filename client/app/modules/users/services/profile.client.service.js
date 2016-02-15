'use strict';

angular.module('users').factory('ProfileService', ProfileService);

ProfileService.$inject = ['$http'];

function ProfileService($http) {
  return {
    login: login,
    getUser: getUser,
    logout: logout
  };

  function getUser() {
    return $http.get('/api/users/me');
  }

  /**
   * Log a specific user via our api
   * @param username username to log in
   * @param password password to log in
   * @returns {*}
     */
  function login(username, password) {
    return $http.post('/api/users/authenticate', {username: username, password: password});
  }

  /**
   * This will logout our current user
   */
  function logout() {
    return $http.get('/api/users/logout');
  }
}
