'use strict';

angular.module('users').controller('ModalAddUser', ModalAddUser);

ModalAddUser.$inject = ['$scope', '$uibModalInstance'];

function ModalAddUser($scope, $uibModalInstance) {
  $scope.username = "";
  $scope.password = "";

  $scope.cancel = cancel;
  $scope.validate = validate;

  // =========================== //
  // functions

  /**
   * Return info about our user we will create
   */
  function validate() {
    $uibModalInstance.close({username: $scope.username, password: $scope.password});
  }

  /**
   * Dismiss modifications
   */
  function cancel() {
    $uibModalInstance.dismiss('cancel');
  }
}
