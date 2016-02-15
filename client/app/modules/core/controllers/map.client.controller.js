'use strict';

angular.module('core').controller('MapController', MapController);

MapController.$inject = ['leafletData', '$scope', 'FileService', '$rootScope'];

function MapController(leafletData, $scope, FileService, $rootScope) {
  var vm = this;

  vm.paths = {};
  vm.markers = {};
  vm.currMarkers = {};
  vm.files = null;
  vm.currIndex = 0;
  vm.nbFiles = null;
  vm.choice = null;
  vm.colors = [];
  vm.zeroString = "0000000"; // equal to FF FF FF + 1 size (7)
  vm.center = {};
  vm.checkbox = {
    markers: false,
    all: false
  };
  vm.getFiles = getFiles;
  vm.createPath = createPath;
  vm.createMarkers = createMarkers;

  // example
  //vm.createPath('p1', vm.points, 'red', 2);
  //vm.createMarkers('p1_markers', vm.points);

  $scope.$watch('vm.checkbox.markers', function(newValue, oldValue) {
      if (newValue) {
        vm.markers = vm.currMarkers;
      } else {
        vm.markers = {};
      }
  });

  $scope.$watch('vm.checkbox.all', function(newValue, oldValue) {
    if (newValue != null) {
      vm.paths = {};
      vm.currMarkers = {};
      vm.markers = {};
      if (newValue) {
        var color;
        var ratio = vm.colors.length / vm.files.length;
        if (ratio == 0) { ratio = 1; }
        for (var i = 0; i < vm.files.length; ++i) {
          color = vm.colors[Math.floor((i * ratio)) % vm.colors.length];
          getContentFile(i, color);
        }
      } else {
        if (vm.files != null && vm.files.length > 0)
          getContentFile(vm.currIndex, 'red');
      }
    }
  });

  $scope.$watch('vm.choice', function(newValue, oldValue) {

    if (newValue != null) {
      vm.currIndex = newValue;
      vm.paths = {};
      vm.currMarkers = {};
      if (vm.checkbox.all == false)
        getContentFile(newValue, 'red');
    }
  });

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
        });
        vm.nbFiles = vm.files.length;
      })
      .catch(function(error) {
        addAlert('danger', 'Unable to get files from api.');
        console.log('error: ');
        console.log(error);
      });
  }

  /**
   * It will create a new path and add it into our array
   * @param name
   * @param points
   * @param color
   * @param weight
   * @param center
   */
  function createPath(name, points, color, weight) {
    var _points = [];

    for (var i = 0; i < points.length; ++i) {
      _points.push({lat: points[i].lat, lng: points[i].lng});
    }
    var path = {
      color: color,
      weight: weight,
      latlngs: _points
    };

    vm.paths[name] = path;
  }

  function createMarkers(name, markers) {
    for (var i = 0; i < markers.length; ++i) {
      vm.currMarkers[name + i] = markers[i];
    }
    if (vm.checkbox.markers) { vm.markers = vm.currMarkers; }
  }

  function addAlert(type, message) {
    $rootScope.$broadcast('addAlert', {type: type, msg: message});
  }

  function getContentFile(index, color) {
    var url = vm.files[index].csvPath;
    FileService.getContentFile(url).then(function(content) {
      var data = JSON.parse(FileService.CSV2JSON(content.data));
      vm.date = vm.files[index].date;
      var tmpMarkers = [];
      if (data.length == 0 || data[0].lat == null || data[0].lng == null || data[0].speed == null || data[0].date == null) {
        addAlert('danger', 'Wrong CSV file.');
        return ;
      }
      for (var i = 0; i < data.length; ++i) {
        if (data[i].lat == null || data[i].lat === "") continue;
        tmpMarkers.push({lat: parseFloat(data[i].lat), lng: parseFloat(data[i].lng), focus: false, draggable: false, message: 'speed: ' + data[i].speed});
      }
      vm.center = {lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lng), zoom: 14};
      vm.createPath(index + '_', tmpMarkers, color, 4);
      vm.createMarkers(index + '_markers_', tmpMarkers);
    }).catch(function(error) {
      console.log('error: ', error);
    });
  }

  vm.colors = ["#000000",
    "#000080",
    "#00008B",
    "#0000CD",
    "#0000FF",
    "#006400",
    "#008000",
    "#008080",
    "#008B8B",
    "#00BFFF",
    "#00CED1",
    "#00FA9A",
    "#00FF00",
    "#00FF7F",
    "#00FFFF",
    "#00FFFF",
    "#191970",
    "#1E90FF",
    "#20B2AA",
    "#228B22",
    "#2E8B57",
    "#2F4F4F",
    "#2F4F4F",
    "#32CD32",
    "#3CB371",
    "#40E0D0",
    "#4169E1",
    "#4682B4",
    "#483D8B",
    "#48D1CC",
    "#4B0082",
    "#556B2F",
    "#5F9EA0",
    "#6495ED",
    "#663399",
    "#66CDAA",
    "#696969",
    "#696969",
    "#6A5ACD",
    "#6B8E23",
    "#708090",
    "#708090",
    "#778899",
    "#778899",
    "#7B68EE",
    "#7CFC00",
    "#7FFF00",
    "#7FFFD4",
    "#800000",
    "#800080",
    "#808000",
    "#808080",
    "#808080",
    "#87CEEB",
    "#87CEFA",
    "#8A2BE2",
    "#8B0000",
    "#8B008B",
    "#8B4513",
    "#8FBC8F",
    "#90EE90",
    "#9370DB",
    "#9400D3",
    "#98FB98",
    "#9932CC",
    "#9ACD32",
    "#A0522D",
    "#A52A2A",
    "#A9A9A9",
    "#A9A9A9",
    "#ADD8E6",
    "#ADFF2F",
    "#AFEEEE",
    "#B0C4DE",
    "#B0E0E6",
    "#B22222",
    "#B8860B",
    "#BA55D3",
    "#BC8F8F",
    "#BDB76B",
    "#C0C0C0",
    "#C71585",
    "#CD5C5C",
    "#CD853F",
    "#D2691E",
    "#D2B48C",
    "#D3D3D3",
    "#D3D3D3",
    "#D8BFD8",
    "#DA70D6",
    "#DAA520",
    "#DB7093",
    "#DC143C",
    "#DCDCDC",
    "#DDA0DD",
    "#DEB887",
    "#E0FFFF",
    "#E6E6FA",
    "#E9967A",
    "#EE82EE",
    "#EEE8AA",
    "#F08080",
    "#F0E68C",
    "#F0F8FF",
    "#F0FFF0",
    "#F0FFFF",
    "#F4A460",
    "#F5DEB3",
    "#F5F5DC",
    "#F5F5F5",
    "#F5FFFA",
    "#F8F8FF",
    "#FA8072",
    "#FAEBD7",
    "#FAF0E6",
    "#FAFAD2",
    "#FDF5E6",
    "#FF0000",
    "#FF00FF",
    "#FF00FF",
    "#FF1493",
    "#FF4500",
    "#FF6347",
    "#FF69B4",
    "#FF7F50",
    "#FF8C00",
    "#FFA07A",
    "#FFA500",
    "#FFB6C1",
    "#FFC0CB",
    "#FFD700",
    "#FFDAB9",
    "#FFDEAD",
    "#FFE4B5",
    "#FFE4C4",
    "#FFE4E1",
    "#FFEBCD",
    "#FFEFD5",
    "#FFF0F5",
    "#FFF5EE",
    "#FFF8DC",
    "#FFFACD",
    "#FFFAF0",
    "#FFFAFA",
    "#FFFF00",
    "#FFFFE0",
    "#FFFFF0",
    "#FFFFFF"
  ]
}
