'use strict';

angular.module('core').controller('ChartsController', ChartsController);

ChartsController.$inject = ['$scope', '$filter', 'FileService', '$rootScope'];

function ChartsController($scope, $filter, FileService, $rootScope) {
  var vm = this;

  vm.choice = null;

  vm.getFiles = getFiles;
  vm.hover = hover;
  vm.refreshLimits = refreshLimits;
  vm.minValue = null;
  vm.maxValue = null;
  vm.chart = null;
  vm.files = [];

  vm.date = null;
  vm.labels = null;
  vm.data = null;
  vm.options = {
    pointDot: true,
    pointHitDetectionRadius: 1,
    multiTooltipTemplate: function(label) {
      return 'speed: ' + label.value;
    },
    tooltipTemplate: function(label) {
      return 'speed: ' + label.value;
    }
  };
  vm.onClick = function (points, evt) {
    console.log(points, evt);
  };

  $scope.$watch('vm.choice', function(newValue, oldValue) {
    console.log('old: ' + oldValue);
    console.log('new: ' + newValue);
    if (newValue != null)
      getContentFile(newValue);
  });

  function refreshLimits() {
     getIntervalLimits(vm.minValue, vm.maxValue);
  }

  function tooltipFunction(label) {
    return 'speed: ' + label.value;
  }

  $scope.$watch('vm.minValue', function(newValue, oldValue) {
    if (newValue != null) {
      getIntervalLimits(vm.minValue, vm.maxValue);
    }
  });

  $scope.$watch('vm.maxValue', function(newValue, oldValue) {
    if (newValue != null) {
      getIntervalLimits(vm.minValue, vm.maxValue);
    }
  });

  function getIntervalLimits(min, max) {
    if (vm.minValue && parseInt(vm.minValue) && vm.maxValue && parseInt(vm.maxValue) && parseInt(vm.minValue) >= 0 && parseInt(vm.minValue) <= parseInt(vm.maxValue) && vm.chart && vm.chart.chart) {
      vm.chart.chart.regions = [{axis: 'y', start: vm.minValue, end: vm.maxValue, class: 'warning'}];
      console.log('getIntervalLimits');
      var overLimits = 0;
      var inLimits = 0;
      if (vm.chart != null && vm.chart.data != null && vm.chart.data.length > 0) {
        vm.chart.data.forEach(function (data) {
          if (data.value < min || data.value > max) {
            ++overLimits;
          } else {
            ++inLimits;
          }
        });
        vm.labels = ['Normal values (%)', 'Limit values (%)'];
        var total = overLimits + inLimits;
        var normal = overLimits / total * 100;
        var limit = inLimits / total * 100;
        vm.data = [normal.toFixed(2), limit.toFixed(2)];
      }
    }
  }

  /**
   * get files from our api and parse our date (updatedAt)
   * @returns {*|Promise.<T>}
   */
  function getFiles() {
    return FileService.getFiles()
      .then(function(response) {
        vm.files = response.data.csvs;
        vm.files.forEach(function(file) {
          file.date = Date.parse(file.updatedAt);
          file.value = file.deviceName + ' | ' +  $filter('date')(file.date, 'yyyy-MM-dd HH:mm');
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

  function hover(point, event) {
    console.log('hover', point, event);
  }

  function addAlert(type, message) {
    $rootScope.$broadcast('addAlert', {type: type, msg: message});
  }

  function getContentFile(index) {
    var url = vm.files[index].csvPath;
    FileService.getContentFile(url).then(function(content) {
      var data = JSON.parse(FileService.CSV2JSON(content.data));
      vm.date = vm.files[index].date;
      vm.chart = {
        data: [],
        state: {
          range: [0, 10]
        },
        chart: {
          legend: {
            position: 'right'
          },
          axis: {
            x: {
              show: false
            }
          },
          regions: [],
          subchart: {
            show: true
          },
          zoom: {
            enabled: true
          },
          extent: [0, 10]
        },
        dimensions: {
          date: {
            axis: 'x'
          },
          value: {
            axis: 'y',
            type: 'area',
            color: 'lightblue',
            postfix: 'km/h',
            name: 'speed / time (4s)'
          }
        }
      };
      var tmpX = [];
      var tmpY = [];
      if (vm.minValue != null && vm.chart != null) {
        console.log(vm.chart);
        vm.chart.chart.regions = [{axis: 'y', start: vm.minValue, end: vm.maxValue, class: 'warning'}];
        getIntervalLimits(vm.minValue, vm.maxValue);
      }
      if (data.length > 10) {
        data.forEach(function (elt, index) {
          if (elt.speed && elt.speed !== '') {
//            if (index % 10 == 0) tmpX.push($filter('date')(elt.date * 1000, "HH:mm:ss"));
//            else tmpX.push('');
//            tmpY.push(elt.speed);
            vm.chart.data.push({value: elt.speed, date: $filter('date')(elt.date * 1000, 'HH:mm:ss')});
          }
        });
      } else {
        data.forEach(function (elt) {
          if (elt.speed && elt.speed !== '') {
//            tmpX.push($filter('date')(elt.date * 1000, "HH:mm:ss"));
//            tmpY.push(elt.speed);
            vm.chart.data.push({value: elt.speed, date: $filter('date')(elt.date * 1000, 'HH:mm:ss')});
          }
        });
      }
      vm.labels = tmpX;
      vm.data = [tmpY];

    }).catch(function(error) {
      console.log('error: ', error);
    });
  }

}
