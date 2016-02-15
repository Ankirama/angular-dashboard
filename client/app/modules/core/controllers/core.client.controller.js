'use strict';

angular.module('core').controller('CoreController', CoreController);

CoreController.$inject = [];

function CoreController() {
    var vm = this;

    vm.variable = 'hello world';
}