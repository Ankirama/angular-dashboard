'use strict';

angular.module('users').controller('ModalUploadFile', ModalUploadFile);

ModalUploadFile.$inject = ['$scope', '$uibModalInstance', 'FileService'];

function ModalUploadFile($scope, $uibModalInstance, FileService) {
  $scope.deviceName = "";
  $scope.myFile = null;
  $scope.extensionsAllowed = ['.csv'];

  $scope.cancel = cancel;
  $scope.upload = upload;
  $scope.checkFiles = checkFiles;


  // =========================== //
  // functions
  function cancel() {
    $uibModalInstance.dismiss('cancel');
  }

  function checkFiles(file) {
    if (FileService.checkExtension(file.name, $scope.extensionsAllowed)) {
      $scope.myFile = file;
    } else {
      alert('Wrong file extension.');
    }
  }

  function upload() {
    $uibModalInstance.close({deviceName: $scope.deviceName, file: $scope.myFile});
  }
}
