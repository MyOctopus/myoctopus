angular.module('myOctopus.services', [])

.factory('Devices', function ($q, $rootScope) {
  // Might use a resource here that returns a JSON array
  var octopusSvcId = '336c7591-0879-42ba-af69-b13e491e0b3a';

  // Some fake testing data
  var scanDevs = [],
      registeredDevs = null,
      regDevsKey = 'octopus::registeredDevices';

  var deviceToRecord = function (device) {
    return {
      id: device.id,
      name: device.name,
      lastText: device.rssi.toString(),
      face: 'img/octopus.jpg'
    };
  };

  var get = function (devId, where) {
    for (var i = 0; i < where.length; i++) {
      if (where[i].id === devId) {
        return where[i];
      }
    }

    return null;
  };

  var value = localStorage.getItem(regDevsKey) || JSON.stringify([]);
  registeredDevs = JSON.parse(value);

  return {
    allScan: function () {
      return scanDevs;
    },
    allRegistered: function () {
      return registeredDevs;
    },
    registerDev: function (dev) {
      registeredDevs.push(dev);
      localStorage.setItem(regDevsKey, JSON.stringify(registeredDevs));
    },
    unregisterDev: function (dev) {
      registeredDevs.splice(registeredDevs.indexOf(dev), 1);
      localStorage.setItem(regDevsKey, JSON.stringify(registeredDevs));
    },
    getScanned: function (devId) {
      return get(devId, scanDevs);
    },
    getRegistered: function (devId) {
      return get(devId, registeredDevs);
    },
    deviceToRecord: deviceToRecord,
    startScan: function (onDeviceFound, onScanComplete) {
      scanDevs = [];
      ble.startScan(
        [octopusSvcId],
        function (device) {
          var record = deviceToRecord(device);
          scanDevs.push(record);
          if (onDeviceFound) {
            onDeviceFound(record);
          }
        },
        function (err) {
          ble.stopScan();
          if (onScanComplete) onScanComplete(err);
        });

      setTimeout(
        ble.stopScan,
        10000,
        function () { if (onScanComplete) onScanComplete(); },
        function (err) { if (onScanComplete) onScanComplete(err); }
      );
    }
  };
})

.factory('Network', function ($http, $q) {
  var getAddress = function (ip, path) {
    return 'http://' + ip + ':8081/' + path;
  };

  return {
    setLigth: function (ip, value) {
      var address = getAddress(ip, 'data/light');
      var d = $q.defer();
      $http.defaults.headers.put["Content-Type"] = "application/json";
      $http.put(address, JSON.stringify(value))
      .success(function (data, status, headers, config) {
        d.resolve(data);
      }).error(function (data, status, headers, config) {
        d.reject(data);
      });

      return d.promise;
    },
    getLight: function (ip) {
      var address = getAddress(ip, 'data/light');
      var d = $q.defer();
      $http.get(address)
      .success(function (data, status) {
        d.resolve(JSON.parse(data));
      }).error(function (data, status) {
        d.reject(data);
      });

      return d.promise;
    },
    test: function (ip) {
      var address = getAddress(ip, 'test');
      var d = $q.defer();
      $http.get(address)
      .success(function (data, status) {
        d.resolve(data);
      }).error(function (data, status) {
        d.reject(data);
      });

      return d.promise;
    }
  };
});