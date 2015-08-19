angular.module("myOctopusDMC")
    .factory('octopusDeviceService', function($q) {
        var service = {};
        service.getCpuStats = function(){
            return $q(function(resolve,reject){
                var stats = {};
                stats.cpuUsagePercent = Math.floor((Math.random() * 100) + 1);
                resolve(stats);
            });
        };
        service.getMemoryStats = function(){
            return $q(function(resolve,reject){
                var stats = {};
                stats.totalMemory = 400000;
                stats.freeMemoryPercentage = Math.floor((Math.random() * 100) + 1);
                resolve(stats);
            });
        };
        service.getStorageStats = function(){
            return $q(function(resolve,reject){
                var stats = {};
                stats.totalStorageSizeInMB = 4000;
                stats.freeStorageSizeInMB = Math.floor((Math.random() * 4000) + 1);
                stats.freeStorageSizeInPercentage = Math.floor((Math.random() * 100) + 1);
                resolve(stats);
            });
        };
        service.getWifiStats = function(){
            return $q(function(resolve,reject){
                var stats = {};
                stats.isEnabled = true;
                stats.isConnected = true;
                stats.networkSSID = 'Home network';
                resolve(stats);
            });
        };
        service.getBluetoothStats = function(){
            return $q(function(resolve,reject){
                var stats = {};
                stats.isEnabled = true;
                resolve(stats);
            });
        };
        service.getSensorsStats = function(){
            return $q(function(resolve,reject){
                var currentDate =  new Date();
                var stats = {};
                stats.sensors = [];
                stats.sensors.push( { sensor: Octopus.sensors.temperature, lastReadingDate: currentDate, lastReadingValue: Math.floor((Math.random() * 1000) + 1) });
                stats.sensors.push( { sensor: Octopus.sensors.humidity, lastReadingDate: currentDate, lastReadingValue: Math.floor((Math.random() * 1000) + 1) });
                stats.sensors.push( { sensor: Octopus.sensors.light, lastReadingDate: currentDate, lastReadingValue: Math.floor((Math.random() * 1000) + 1) });
                stats.sensors.push( { sensor: Octopus.sensors.pressure, lastReadingDate: currentDate, lastReadingValue: Math.floor((Math.random() * 1000) + 1) });
                resolve(stats);
            });
        };
        service.getSensorsHistoricValues = function(filter){
            //filter.sensor
            //filter.from;
            //filter.to;
            return $q(function(resolve,reject){
                setTimeout(function() {
                    var fakeResults_q = Math.floor((Math.random() * 50) + 1);
                    var randDate = function getRandomDate(from, to) {
                        if (!from) {
                            from = new Date(1900, 0, 1).getTime();
                        } else {
                            from = from.getTime();
                        }
                        if (!to) {
                            to = new Date(2100, 0, 1).getTime();
                        } else {
                            to = to.getTime();
                        }
                        return new Date(from + Math.random() * (to - from));
                    };
                    var results = {};
                    results.data = [];
                    for(i=0;i<fakeResults_q;i++){
                        var row = [];
                        row.push(randDate(filter.from, filter.to));
                        row.push(Math.floor((Math.random() * 100) + 1));
                        results.data.push(row);
                    }
                    resolve(results);
                }, 1000);

            });
        };
        return service;
    });

var Octopus = Octopus || {};
Octopus.sensors = {
    temperature : { id: 1, name: 'Temperature' },
    humidity: { id: 2, name: "Humidity"},
    light: { id: 3, name: 'Light'},
    pressure: {id: 4, name: 'Pressure'}
};