'use strict';

angular.module('core').controller('InfosController', InfosController);

InfosController.$inject = ['UsersService'];

function InfosController(UsersService) {
  var vm = this;

  vm.currentUser = null;
  vm.users = null;

  vm.getUsers = getUsers;


  function getUsers() {
    UsersService.getUsers().then(function(response) {
      vm.users = response.data.users;
    });
  }


}
