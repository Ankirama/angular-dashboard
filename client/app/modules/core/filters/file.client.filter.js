'use strict';

angular.module('FileFilter', [])
    .filter('user', function() {
        return function(input, user) {
            return input.username === user;
        };
    })
    .filter('device', function() {
       return function(input, device) {

       };
    });