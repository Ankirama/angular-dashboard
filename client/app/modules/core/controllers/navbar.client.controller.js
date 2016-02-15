'use strict';

angular.module('core').controller('NavbarController', NavbarController);

NavbarController.$inject = ['ProfileService', 'SettingsService', '$cookies', '$scope', '$location', '$uibModal'];

function NavbarController(ProfileService, SettingsService, $cookies, $scope, $location, $uibModal) {

  $scope.user = null;
  $scope.authenticated = false;
  $scope.toggle = true;
  $scope.alerts = [];

  $scope.getUser = getUser;
  $scope.toggleSidebar = toggleSideBar;
  $scope.isLogginPage = isLogginPage; //<-- check url
  $scope.logout = logout;
  $scope.getSettings = getSettings;
  $scope.wrapperid = "page-wrapper";
  $scope.addAlert = addAlert;
  $scope.closeAlert = closeAlert;

  // Try to get our user
  $scope.getUser();

  function isLogginPage() {
    if ($location.path().substring(0, 6) == "/login") {
      $scope.wrapperid = "noidhere";
      return true;
    } else {
      $scope.wrapperid = "page-wrapper";
      return false;
    }
  }

  // ======== //
  //  Alerts  //
  // ======== //
  $scope.$on('addAlert', function(event, alert) {
    addAlert(alert.type, alert.msg);
  });

  function addAlert(type, message) {
    $scope.alerts.push({type: type, msg: message});
  }

  function closeAlert(index) {
    $scope.alerts.splice(index, 1);
  }

  // ============ //
  //  End Alerts  //
  // ============ //

  /**
   * Define settings from our api and create array of object then call modalUserOpen to render it
   * @param user
   */
  function getSettings() {
    if ($scope.user.settings === null) {
      console.log('no settings found. ');
    } else {
      SettingsService.getSettingsUser($scope.user.settings)
        .then(function (response) {
          var settings = [];
          for (var property in response.data.settings) {
            if (response.data.settings.hasOwnProperty(property) && property !== "_id" && property !== "__v") {
              settings.push({option: property, state: response.data.settings[property]});
            }
          }
          modalSettingsOpen($scope.user, settings);
        })
        .catch(function (error) {
          addAlert('danger', 'Unable to get user settings.');
          console.log('error: ');
          console.log(error);
        });
    }
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

  /**
   * Try to get user info
   */
  function getUser() {
    ProfileService.getUser()
      .then(function(response) {
        $scope.user = response.data.user;
        $scope.user.username = $scope.user.username.charAt(0).toUpperCase() + $scope.user.username.slice(1);
      })
      .catch(function(error) {console.log('error');});
  }

  function toggleSideBar() {
    $scope.toggle = !$scope.toggle;
    $cookies.put('toggle', $scope.toggle);
  }

  /**
   * Sidebar Toggle & Cookie Control
   */
  var mobileView = 992;

  $scope.getWidth = function() {
    return window.innerWidth;
  };

  $scope.$watch($scope.getWidth, function(newValue, oldValue) {
    if (newValue >= mobileView) {
      if (angular.isDefined($cookies.get('toggle'))) {
        $scope.toggle = $cookies.get('toggle');
      } else {
        $scope.toggle = true;
      }
    } else {
      $scope.toggle = false;
    }
  });

  function logout() {
    ProfileService.logout()
      .then(function(response) {
        $scope.user = null;
        $location.path('/login');
      })
      .catch(function(error) { console.log('error'); })
  }

  window.onresize = function() {
    $scope.$apply();
  };
}
