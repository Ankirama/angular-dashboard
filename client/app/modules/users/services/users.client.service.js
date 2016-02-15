'use strict';

angular.module('users').factory('UsersService', UsersService);

UsersService.$inject = ['$http'];

function UsersService($http) {
  return {
    getUsers: getUsers,
    getUser: getUser,
    delUser: delUser,
    createUser: createUser,
  };

  function getUsers() {
    return $http.get('/api/users');
  }

  function getUser(id) {
    return $http.get('/api/users/' + id);
  }

  function delUser(id) {
    return $http.delete('/api/users/' + id);
  }

  function createUser(username, password) {
    return $http.post('/api/users', {username: username, password: password});
  }
}
