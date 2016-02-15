/**
 * Home controller (dashboard).
 * It will get users, csv, etc...
 */

'use strict';

angular.module('users').controller('DashboardController', DashboardController);

DashboardController.$inject = ['$rootScope', 'UsersService', 'SettingsService', 'FileService', '$uibModal'];

function DashboardController($rootScope, UsersService, SettingsService, FileService, $uibModal) {
  var vm = this;

  vm.users = null;
  vm.files = null;
  vm.nbUsers = null;
  vm.nbFiles = null;

  vm.init = init;
  vm.getUsers = getUsers;
  vm.deleteUser = deleteUser;
  vm.deleteUpload = deleteUpload;
  vm.getFiles = getFiles;
  vm.getSettings = getSettings;
  vm.modalNewUserOpen = modalNewUserOpen;
  vm.modalUploadFile = modalUploadFile;
  //vm.modalUserOpen = modalUserOpen;

  // =========================== //

  function init() {
    getUsers();
    getFiles();
  }

  function getUsers() {
    console.log('getUsers');
    return UsersService.getUsers()
      .then(function(response) {
        vm.users = response.data.users;
        vm.users.sort();
        vm.nbUsers = vm.users.length;
      })
      .catch(function(error) {
        addAlert('danger', 'Unable to get users from api.');
        console.log(error);
      })
  }

  /**
   * get files from our api and parse our date (updatedAt)
   * @returns {*|Promise.<T>}
   */
  function getFiles() {
    console.log('getFiles');
    return FileService.getFiles()
      .then(function(response) {
        vm.files = response.data.csvs;
        vm.files.forEach(function(file) {
          file.date = Date.parse(file.updatedAt);
        });
        console.log(vm.files);
        vm.nbFiles = vm.files.length;
      })
      .catch(function(error) {
        addAlert('danger', 'Unable to get files from api.');
        console.log('error: ');
        console.log(error);
      });
  }

  function deleteUser(id) {
    console.log('deleteUser');
    return UsersService.delUser(id)
      .then(function(response) {
        vm.getUsers();
        addAlert('success', 'User deleted.');
      })
      .catch(function(error) {
        //display error there with alert controller (for example)
        addAlert('danger', 'Unable to delete this user.');
        console.log(error);
      })
  }

  function deleteUpload(id) {
    console.log('deleteUpload');
    return FileService.deleteFile(id)
      .then(function(response) {
        vm.getFiles();
        addAlert('success', 'Data removed.');
      })
    .catch(function(error) {
      addAlert('danger', 'Unable to delete this data.');
      console.log(error);
    })
  }

  // ====================
  // private functions


  function addAlert(type, message) {
    $rootScope.$broadcast('addAlert', {type: type, msg: message});
  }

  /**
   * Define settings from our api and create array of object then call modalUserOpen to render it
   * @param user
   */
  function getSettings(user) {
    if (user.settings === null) {
      addAlert('danger', 'No settings found for this user.'); //rajouter de quoi en creer
    } else {
      SettingsService.getSettingsUser(user.settings)
        .then(function (response) {
          var settings = [];
          for (var property in response.data.settings) {
            if (response.data.settings.hasOwnProperty(property) && property !== "_id" && property !== "__v") {
              settings.push({option: property, state: response.data.settings[property]});
            }
          }
          modalSettingsOpen(user, settings);
        })
        .catch(function (error) {
          addAlert('danger', 'Unable to get user settings.');
          console.log('error: ');
          console.log(error);
        });
    }
  }

  // ====================
  // modals

  function modalUploadFile() {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'modalUploadFile.html',
      controller: 'ModalUploadFile'
    });

    modalInstance.result.then(function(response) {
      FileService.uploadFile(response.deviceName, response.file)
        .then(function(response) {
          addAlert('success', 'File uploaded with success.');
          getFiles();
        })
        .catch(function(error) {
          addAlert('danger', 'Unable to upload your file.');
          console.log('error: ');
          console.log(error);
        })
      console.log(response);
    })
  }

  function modalNewUserOpen() {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'modalNewUser.html',
      controller: 'ModalAddUser'
    });

    modalInstance.result.then(function(user) {
      UsersService.createUser(user.username, user.password)
        .then(function(response) {
          addAlert('success', 'User created.');
          vm.getUsers();
        })
        .catch(function(error) {
          addAlert('danger', 'Unable to create a new user.');
          console.log('error: ');
          console.log(error);
        })
    })
  }

  function modalSettingsOpen(user, settings) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'modalSettings.html',
      controller: 'ModalProfile',
      resolve: {
        user: function() {
          return user;
        },
        settings: function() {
          return settings
        }
      }
    });

    modalInstance.result.then(function(infos) {
      var tmp = {};
      var id = infos.id;
      var settings = infos.settings;
      for (var i = 0; i < settings.length; ++i) {
        tmp[settings[i].option] = settings[i].state == 1 || settings[i].state ? true: false;
        if (i + 1 == settings.length) {
          SettingsService.updateSettingsUser(id, tmp)
            .then(function(response) {
              console.log('settings updated');
              console.log(response);
              addAlert('success', 'Settings updated.');
              //message in alert;
            })
            .catch(function(error) {
              addAlert('danger', 'Unable to update these settings.');
              console.log('error: ');
              console.log(error);
            });
        }
      }
    });
  }
}
