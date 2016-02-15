/**
 * modal profile to update a user.
 */

'use strict';

angular.module('users').controller('ModalProfile', ModalProfile).filter('mapState', mapState);

ModalProfile.$inject = ['$scope', '$uibModalInstance', 'user', 'settings'];

function ModalProfile($scope, $uibModalInstance, user, settings) {
  $scope.user = user;
  $scope.settings = settings;
  $scope.gridOptions = {};
  $scope.gridOptions.data = settings;

  $scope.cancel = cancel;
  $scope.update = update;

  // =========================== //
  // grid parameters
  $scope.gridOptions.columnDefs = [
    {name: 'option', displayName: 'Option', width: '80%'},
    {name: 'state', displayName: 'State', editableCellTemplate: 'ui-grid/dropdownEditor',
       cellFilter: 'mapState', editDropdownValueLabel: 'state', editDropdownOptionsArray: [
        { id: 1, state: 'true' },
        { id: 2, state: 'false' }
    ]}
  ];


  // =========================== //
  // functions

  /**
   * Return info about our settings and id_settings to update it.
   */
  function update() {
    $uibModalInstance.close({id: $scope.user.settings, settings: $scope.settings});
  }

  /**
   * Dismiss modifications
   */
  function cancel() {
    $uibModalInstance.dismiss('cancel');
  }
}

/**
 * Filter function to get true/false instead of 1/2
 * @returns {Function}
 */
function mapState() {
  var stateHash = {
    1: 'true',
    2: 'false'
  };

  return function(input) {
    if (!input && input != false){
      return '';
    } else {
      if (input == true || input == false) return input;
      else return stateHash[input];
    }
  };
}
