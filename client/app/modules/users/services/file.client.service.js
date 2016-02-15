'use strict';

angular.module('users').factory('FileService', FileService);

FileService.$inject = ['$http'];

function FileService($http) {
  return {
    getFiles: getFiles,
    getFile: getFile,
    checkExtension: checkExtension,
    downloadFile: downloadFile,
    deleteFile: deleteFile,
    uploadFile: uploadFile,
    getContentFile: getContentFile,
    CSVToArray: CSVToArray,
    CSV2JSON: CSV2JSON
  };

  /**
   * @brief: Check if the extension file the user's trying to upload is a valid one
   * @param filename: the name of the file
   * @param extensions: array with extension we allow
   * @returns {boolean}
   */
  function checkExtension(filename, extensions) {
    if (filename != null && filename.length > 0) {
      for (var i = 0; i < extensions.length; ++i) {
        var extension = extensions[i];
        if (filename.substr(filename.length - extension.length, extension.length).toLowerCase() == extension) {
          return true;
        }
      }
    }
    return false;
  }

  function getFiles() {
    return $http.get('/api/csv');
  }

  function getFile(id) {
    return $http.get('/api/csv/' + id);
  }

  function getContentFile(url) {
    return $http.get('/' + url);
  }

  function downloadFile(id) {
    // not sure here
  }

  function deleteFile(id) {
    return $http.delete('/api/csv/' + id);
  }

  /**
   * Upload a file to our server. No check done here
   * @param deviceName our devicename which will upload this file
   * @param file file like a csv
   * @returns {*}
   */
  function uploadFile(deviceName, file) {
    var fd = new FormData();
    fd.append('deviceName', deviceName);
    fd.append('csv', file);
    return $http.post('/api/csv', fd,
      {transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      });
  }


  function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
      // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
      // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
      // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[1];
      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);
      }
      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[2]) {
        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        var strMatchedValue = arrMatches[2].replace(
          new RegExp("\"\"", "g"), "\"");
      } else {
        // We found a non-quoted value.
        var strMatchedValue = arrMatches[3];
      }
      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
  }

  function CSV2JSON(csv) {
    var array = CSVToArray(csv);
    var objArray = [];
    for (var i = 1; i < array.length; i++) {
      objArray[i - 1] = {};
      for (var k = 0; k < array[0].length && k < array[i].length; k++) {
        var key = array[0][k];
        objArray[i - 1][key] = array[i][k]
      }
    }

    var json = JSON.stringify(objArray);
    var str = json.replace(/},/g, "},\r\n");

    return str;
  }
}
