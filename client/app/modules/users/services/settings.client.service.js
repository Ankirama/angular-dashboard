'use strict';

angular.module('users').factory('SettingsService', SettingsService);

SettingsService.$inject = ['$http'];

function SettingsService($http) {
  return {
    getSettings: getSettings,
    getSettingsUser: getSettingsUser,
    updateSettingsUser: updateSettingsUser,
  };

  function getSettings() {
    return $http.get('/api/settings');
  }

  function getSettingsUser(id) {
    return $http.get('/api/settings/' + id);
  }

  function updateSettingsUser(id, settings) {
    return $http.put('/api/settings/' + id, settings);
  }
}
