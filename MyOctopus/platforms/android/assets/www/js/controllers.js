angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Light) {
	Light.getActual();
	$scope.light = {
		turned : (Light.getGraduation() != 0)
	}
	function initialize() {
		$scope.light.turned = (Light.getGraduation() != 0)
	}
	$scope.lightStyle = function() {
		return {
			background : ($scope.light.turned ? "rgba(255,255,0,0.75)" : "rgba(100,100,100,0.7)"),
			'box-shadow' : "0 20px 100px " + ($scope.light.turned ? 0 : 100) + "px inset"
		}
	}
	$scope.swipeChange = function(value) {
		$scope.light.turned = value;
		if (value)
			Light.turnOn();
		else
			Light.turnOff();
	};
	$scope.switchLight = function() {
		if ($scope.light.turned)
			$scope.swipeChange(false)
		else
			$scope.swipeChange(true)
	}
	$scope.$watch("light.turned", function() {
		$scope.swipeChange($scope.light.turned)
	});
	$scope.$on("$ionicView.beforeEnter", initialize);
})

.controller(
		'GradualCtrl',
		function($scope, Light) {
			Light.getActual();
			$scope.light = {
				graduation : Light.getGraduation()
			}
			function initialize() {
				$scope.light.graduation = Light.getGraduation()
			}
			$scope.lightStyle = function() {
				var yellowValue = $scope.light.graduation + 155;
				var blueAndShadowValue = 100 - $scope.light.graduation;
				return {
					background : ($scope.light.graduation != 0 ? "rgba(" + yellowValue + "," + yellowValue + ","
							+ blueAndShadowValue + ",0.75)" : "rgba(100,100,100,0.7)"),
					'box-shadow' : "0 20px 100px " + blueAndShadowValue + "px inset"
				}
			}
			$scope.swipeChange = function(value) {
				if (value)
					if ($scope.light.graduation > 90)
						$scope.light.graduation = 100;
					else
						$scope.light.graduation += 10;
				else if ($scope.light.graduation < 10)
					$scope.light.graduation = 0;
				else
					$scope.light.graduation -= 10;
			};
			$scope.$watch("light.graduation", function() {
				$scope.light.graduation = Light.graduate(parseInt($scope.light.graduation));
			});
			$scope.$on("$ionicView.enter", initialize);
		})

.controller('GraphCtrl', function($scope, $interval, Chart) {
	$scope.graph = {};
	var interval;
	function initialize() {
		interval = $interval(function() {
			if ($scope.graph.scaled)
				Chart.getScaled().then(function(data) {
					$scope.graph = data;
				});
			else
				Chart.get().then(function(data) {
					$scope.graph = data;
				});
		}, 2000);
	}
	function leaving() {
		$interval.cancel(interval);
	}
	$scope.resetGraph = function() {
		Chart.reset();
	}
	$scope.showHideGraph = function(show) {
		Chart.showOrHide(show);
	}
	$scope.switchArea = function(type) {
		Chart.switchArea(type);
	}
	$scope.$on("$ionicView.enter", initialize);
	$scope.$on("$ionicView.leave", leaving);
})

.controller('NetworkCtrl', function ($scope, Settings, $http, $ionicPopup, lodash, $q) {
    $scope.address = { url: '' }
    $scope.error = { iserror: false, message: '' }
    $scope.spinner = { run: false };
    $scope.bluetoothEnabled = false;
    $scope.log = { message: '' }
    $scope.scan = { running: false }
    $scope.device = null;

    var octopusSvcId = '336c7591-0879-42ba-af69-b13e491e0b3a',
        setupInitCharacteristicsId = 'aa59ad9e250b11e5b4eb080027f13330',
        setupDataCharacteristicsId = 'e4d81ca0-90be-45f6-b6a8-a1335c6ffe9d',
        setupDoneCharacteristicsId = 'bbde8a9e250b11e58c29080027f13330',
        onCompleteCharacteristicsId = '5793bd42-6404-4c79-b299-122bbf7d0df1';

    var stringToBytes = function (string) {
        var array = new Uint8Array(string.length);
        for (var i = 0, l = string.length; i < l; i++) {
            array[i] = string.charCodeAt(i);
        }
        return array.buffer;
    }

    var bytesToString = function (buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }

    var writeData = function (data, writeDataFunc) {
        var d = $q.defer();
        var maxRetries = 15;
        if (data.length <= 0) d.resolve();
        else {
            var loop = function (data, i, processData, retryCount) {
                retryCount = retryCount || 0;
                writeDataFunc(data[i], function () {
                    if (++i < data.length) {
                        loop(data, i, processData);
                    } else {
                        d.resolve();
                    }
                }, function (err) {
                    if (retryCount++ < maxRetries) {
                        //console.log('retrying ' + retryCount.toString() + 'th time');
                        loop(data, i, processData, retryCount);
                    } else {
                        d.reject(err);
                    }
                });
            };

            loop(data, 0, writeDataFunc);
        }

        return d.promise;
    }

    var asyncify = function (funcToCall, beforeResolveCallback, params) {
        params = params || [];
        var d = $q.defer();
        var success = function (data) {
            // Return null from the callback if all OK or error if all not OK
            var err = beforeResolveCallback ? beforeResolveCallback(data) : null;
            if (err) d.reject(err);
            else d.resolve(data);
        }
        var error = function (err) { d.reject(err); }
        params = params.concat([success, error]);
        funcToCall.apply(null, params);
        return d.promise;
    }

    var scan = false, notification = false, writing = false, deviceId = null, dataReceived = false;
    $scope.scan = function () {
        $scope.scan.running = true;
        scan = true;
        asyncify(ble.startScan, null, [[octopusSvcId]])
        .then(function (device) { deviceId = device.id; return asyncify(ble.connect, null, [device.id]); })
        .then(function (po) {
            notification = true;
            return asyncify(
                ble.startNotification,
                function (response) {
                    // This is called when the response is sent back from Octopus
                    response = bytesToString(response);
                    // TODO: Verify data integrity
                    ble.stopNotification(deviceId, octopusSvcId, onCompleteCharacteristicsId);
                    dataReceived = true;
                    // TODO: Check for error?
                    return null;
                },
                [deviceId, octopusSvcId, onCompleteCharacteristicsId]);
        })
        .then(function () { writing = true; return asyncify(ble.write, null, [deviceId, octopusSvcId, setupInitCharacteristicsId, stringToByte('octopus')]); })
        .then(function (data) {
            var setupData = angular.toJson({
                key: '8cc5f0aa11ca47a9bb10d252b5f58b60',
                id: 'Octopus Setup Data',
                ssid: 'test',
                wifipwd: '',
                rootpwd: 'testpwd',
                devicename: 'Octopus_abc_001'
            });
            var dataToSend = JSON.stringify(setupData).match(/.{1,20}/g);

            return writeData(deviceId, octopusSvcId, setupDataCharacteristicsId, dataToSend, ble.write);
        })
        .then(function () { writing = true; return asyncify(ble.write, null, [deviceId, octopusSvcId, setupDoneCharacteristicsId, stringToByte('octopus')]); })
        .then(function () {
            // If we got this far then all the config data was successfully written to Octopus through BLE
            // Now we have to wait for Octopus setup process to set up wifi and issue the notification all that we registered in startNotification method
            // If the callback is not called within a minute something went wrong and we disconnect here
            var d = $q.defer();
            setTimeout(function () {
                if (!dataReceived)
                    d.reject(new Error('Notification from Octopus not received withing expected timeframe'));
                else
                    d.resolve();
            }, 75000);

            return d.promise;
        })
        .catch(function (err) {
            $scope.scan.running = false;
            window.plugins.spinnerDialog.hide();
            $ionicPopup.alert({ title: 'Error', template: err }).done();
        })
        .finally(function () { ble.disconnect(deviceId); })
        .done();
    }

/*
    $scope.scan = function () {
        $scope.scan.running = true;
        ble.startScan([octopusSvcId],
            function (device) {
                if ($scope.scan.running) {
                    // Try to connecte the device and check the service and characteristics
                    ble.connect(
                        device.id,
                        function (po) {
                            // Check that the device is Octopus
                            //if (!_.some(po.services, function (svcid) { return svcid.toLower() === octopusSvcId; }) ||
                            //    (!_.some(po.characteristics, function (c) { return c.characteristic.toLower() === setupCharacteristicsId; })) &&
                            //    (!_.some(po.characteristics, function (c) { return c.characteristic.toLower() === onCompleteCharacteristicsId; }))) {
                            //    ble.disconnect(device.id);
                            //} else
                            {
                                // Octopus found, subscribe to listener and initiate setup
                                ble.startNotification(device.id, octopusSvcId, onCompleteCharacteristicsId,
                                    ffunction (data) {
                                        data = bytesToString(data);
                                        ble.stopNotification(device.id, octopusSvcId, onCompleteCharacteristicsId);
                                        ble.disconnect(device.id);
                                    },
                                    function () {
                                        ble.disconnect(device.id);
                                    });

                                var setupData = angular.toJson({
                                    key: '8cc5f0aa11ca47a9bb10d252b5f58b60',
                                    id: 'Octopus Setup Data',
                                    ssid: 'test',
                                    pwd: 'testpwd',
                                    name: 'Octopus_abc_001'
                                });
                                data = stringToBytes(setupData);

                                // Initiate data transfer
                                ble.write(device.id, octopusSvcId, setupInitCharacteristicsId, strigToByte('octopus'),
                                    function () {

                                ble.writeWithoutResponse(device.id, octopusSvcId, setupCharacteristicsId, data,
                                    function () {
                                        $scope.scan.running = false;
                                        window.plugins.spinnerDialog.hide();
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Success',
                                            template: 'Setup for ' + device.name + 'initiated successfully'
                                        });
                                        alertPopup.then(function (res) {
                                        });
                                    },
                                    function () {
                                        ble.disconnect(device.id);
                                        $scope.scan.running = false;
                                        window.plugins.spinnerDialog.hide();
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Error',
                                            template: 'Failed to write setup data to ' + device.name
                                        });
                                        alertPopup.then(function (res) {
                                        });
                                    });
                            }
                        },
                        function () {
                        });
                }
            },
            function (err) {
                if ($scope.scan.running) {
                    $scope.scan.running = false;
                    window.plugins.spinnerDialog.hide();
                    error.iserror = true;
                    error.message = err;
                }
            });

        // spinner with message, and a log message when it's dismissed
        window.plugins.spinnerDialog.show(
            'Octopus Setup', // title
            "Scanning for Octopus devices, please wait...", // message
            function () {
                // dismissed
                $scope.scan.running = false;
                ble.stopScan();
            }
       );

       setTimeout(ble.stopScan,
         5000,
         function () {
             if ($scope.scan.running) {
                 $scope.scan.running = false;
                 window.plugins.spinnerDialog.hide();
             }
         },
         function (err) {
             if ($scope.scan.running) {
                 $scope.scan.running = false;
                 window.plugins.spinnerDialog.hide();
                 error.iserror = true;
                 error.message = err;
             }
         }
      );
    }
*/
    $scope.confirm = function () {
        // test if connection works
        $scope.spinner.run = true;
        var address = 'http://'+ $scope.address.url + '/test';
        $http.get(address).success(function (data, status) {
            $scope.error.iserror = false;
            Settings.setNetwork($scope.address.url);
            $scope.spinner.run = false;
            var alertPopup = $ionicPopup.alert({
                title: 'Test successful',
                template: 'Response: ' + data
            });
            alertPopup.then(function (res) {
            });
        }).error(function (data, status) {
            $scope.error.iserror = true;
            $scope.error.message = data;
            $scope.spinner.run = false;
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Response: ' + status
            });
            alertPopup.then(function (res) {
            });
        });
    }

    function initialize() {
        var address = Settings.getNetwork();
        if ('' == address)
            address = '192.168.0.1:8080';
        $scope.address.url = address;

        ble.isEnabled(
            function () {
                console.log("Settings::Initialize::Bluetooth::isEnabled: true");
            },
            function () {
                console.log("Settings::Initialize::Bluetooth::isEnabled: false");
                ble.enable();
                $scope.bluetoothEnabled = true;
            });
    }

    function leaving() {
        // Turn off bluetooth
        cordova.plugins.locationManager.isBluetoothEnabled()
            .then(function (isEnabled) {
                console.log("Settings::Leaving::Bluetooth::isEnabled: " + isEnabled);
                if (isEnabled) {
                    cordova.plugins.locationManager.disableBluetooth();
                }
            })
            .fail(console.error)
            .done();
    }

    //$scope.$watch("address.url", function (newValue, oldValue) {
    //    $scope.address.url = newValue;
    //});

    $scope.$on("$ionicView.enter", initialize);
    $scope.$on("$ionicView.leave", leaving);
});
