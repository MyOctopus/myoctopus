angular.module('myOctopus.controllers', [])

.controller('SetupMainCtrl', function ($scope, Devices, $ionicLoading, $timeout) {
  $scope.devs = [];
  $scope.error = { text: '' };
  $scope.startScan = function () {
    $scope.devs = [];
    $ionicLoading.show({ template: '<ion-spinner></ion-spinner><span>&nbsp;Searching for MyOctopus devices...</span>' });
    Devices.startScan(
      function (device) {
        $scope.devs = Devices.allScan();
      },
      function (err) {
        $scope.$apply(function () {
          $scope.error.text = err;
          $ionicLoading.hide();
        });
      }
    );
  };

  $scope.bluetooth = { enabled: false };

  var checkBluetoothEnabled = function () {
    ble.isEnabled(
      function () {
        // Called when bluetooth enabled
        $scope.bluetooth.enabled = true;
        $ionicLoading.hide();
      },
      function () {
        // Called when bluetooth NOT enabled
        $ionicLoading.hide();
      });
  };

  $scope.onBleEnabledToggle = function () {
    if ($scope.bluetooth.enabled) {
      $ionicLoading.show({ template: 'Enabling bluetooth...' });
      ble.enable(
        function () {
          $ionicLoading.hide();
        },
        function () {
          $ionicLoading.hide();
          $scope.bluetooth.enabled = false;
        });
    }
  };

  $ionicLoading.show({ template: 'Detecting bluetooth...' });
  $timeout(
    checkBluetoothEnabled,
    500);
})

.controller('SetupDevCtrl', function ($scope, $stateParams, Devices, $q, $ionicPopup, $ionicLoading, $location, lodash, $http) {
  var _ = lodash;
  $scope.dev = Devices.getScanned($stateParams.devId);

  $scope.setupData = {
    deviceName: '',
    devicePwd: '',
    wifiSsid: '',
    wifiPwd: ''
  };

  $scope.changeView = function (view) {
    $location.path(view); // path not hash
  };

  $scope.dataValid = function () {
    return $scope.setupData.wifiSsid.length > 0 && $scope.setupData.wifiPwd.length >= 8 &&
      ($scope.setupData.devicePwd.length == 0 || $scope.setupData.devicePwd.length >= 8);
  };

  var octopusSvcId = '336c7591-0879-42ba-af69-b13e491e0b3a',
      setupInitCharacteristicsId = 'aa59ad9e-250b-11e5-b4eb-080027f13330',
      setupDataCharacteristicsId = 'e4d81ca0-90be-45f6-b6a8-a1335c6ffe9d',
      setupDoneCharacteristicsId = 'bbde8a9e-250b-11e5-8c29-080027f13330',
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

  var writeData = function (deviceId, serviceId, characteristicsId, data, writeDataFunc) {
    var d = $q.defer();
    var maxRetries = 15;
    if (data.length <= 0) d.resolve();
    else {
      var loop = function (deviceId, serviceId, characteristicsId, data, i, processData, retryCount) {
        retryCount = retryCount || 0;
        processData(
          deviceId, serviceId, characteristicsId,
          stringToBytes(data[i]),
          function () {
            if (++i < data.length) {
              loop(deviceId, serviceId, characteristicsId, data, i, processData);
            } else {
              d.resolve();
            }
          },
          function (err) {
            if (retryCount++ < maxRetries) {
              //console.log('retrying ' + retryCount.toString() + 'th time');
              loop(deviceId, serviceId, characteristicsId, data, i, processData, retryCount);
            } else {
              d.reject(err);
            }
          });
      };

      loop(deviceId, serviceId, characteristicsId, data, 0, writeDataFunc);
    }

    return d.promise;
  }

  var asyncify = function (funcToCall, params) {
    params = params || [];
    var d = $q.defer();
    var success = function (data) { d.resolve(data); }
    var error = function (err) { d.reject(err); }
    params = params.concat([success, error]);
    funcToCall.apply(null, params);
    return d.promise;
  }

  var connected = false, notification = false, writing = false, dataReceived = false, timeout = false, result = null;
  var finalizeAndDisconnect = function () {
    var d = $q.defer(),
        r = $q.defer();
    if (notification)
      ble.stopNotification(
        $scope.dev.id, octopusSvcId, onCompleteCharacteristicsId,
        function () { notification = false; d.resolve(); },
        function () { d.resolve(); }
      );
    else
      d.resolve();

    d.promise
    .then(function () {
      var d2 = $q.defer();
      if (connected)
        ble.disconnect(
          $scope.dev.id,
          function () { connected = false; d2.resolve(); },
          function () { d2.resolve(); }
        );
      else
        d2.resolve();

      return d2.promise;
    })
    .finally(function () {
      $ionicLoading.hide();
      r.resolve();
    });

    return r.promise;
  };

  var addOrUpdateDevice = function (device, ip, name) {
    var dev = Devices.getRegistered(device.id),
        push = false;
    if (!dev) { dev = { id: device.id }; push = true; };
    _.extend(dev, { name: name || $scope.dev.name, ip: ip, status: 'unknown', statusColor: 'orange', heartbeat: 0 });
    if (push)
      Devices.registerDev(dev);
  }

  $scope.initSetup = function () {
    // spinner with message, and a log message when it's dismissed
    $ionicLoading.show({ template: '<ion-spinner></ion-spinner><span>&nbsp;Setting up ' + $scope.dev.name + ', please wait...</span>' });

    // Doc for the BLE methods is here: https://github.com/don/cordova-plugin-ble-central
    asyncify(ble.connect, [$scope.dev.id])
    .then(function (po) {
      connected = true;
      notification = true;
      var d = $q.defer();
      // Check that the device is Octopus
      //if (!_.some(po.services, function (svcid) { return svcid.toLower() === octopusSvcId; }) ||
      //    (!_.some(po.characteristics, function (c) { return c.characteristic.toLower() === setupCharacteristicsId; })) &&
      //    (!_.some(po.characteristics, function (c) { return c.characteristic.toLower() === onCompleteCharacteristicsId; }))) {
      //    ble.disconnect(device.id);
      //} else
      ble.startNotification(
        $scope.dev.id, octopusSvcId, onCompleteCharacteristicsId,
        function (response) {
          // This is called when the response is sent back from Octopus
          // It is called at most twice, once with result code and if
          // there was no error then the second time with the IP address
          response = bytesToString(response);
          response = JSON.parse(response);
          var error = '';
          if (null == result) {
            result = response.result;
            if (0 != result) {
              disconnect = true;
              dataReceived = true;
              // Decipher the result code
              switch (result) {
                case 1:
                  // The device password length is wrong
                  error = 'Wrong device password length (8-63)';
                  break;
                case 2:
                  // SSID not found
                  error = 'The SSID ' + $scope.setupData.wifiSsid + ' not found';
                  break;
                case 3:
                  // Wrong wifi password length
                  error = 'Wrong wifi password length';
                  break;
                case 4:
                  // Failed to check the newly configured network
                  error = 'Failed to check the newly configured network';
                  break;
                default:
                  error = 'Unrecognized error code (' + error.toString() + ')';
                  break;
              }
            }
          } else if (0 == result) {
            // Read the IP
            var ip = response.ip;
            addOrUpdateDevice($scope.dev, ip, $scope.setupData.deviceName);
            dataReceived = true;
            finalizeAndDisconnect().then(function () { $ionicLoading.hide(); $scope.changeView('/tab/devices'); });
          }

          if (error) {
            $ionicLoading.hide();
            $ionicPopup.alert({ title: 'Error', template: error });
          }
        },
        function () {
          $ionicLoading.hide();
          $ionicPopup.alert({ title: 'Error', template: 'Connection interrupted' });
        });
      d.resolve();
      return d.promise;
    })
    .then(function () { writing = true; return asyncify(ble.write, [$scope.dev.id, octopusSvcId, setupInitCharacteristicsId, stringToBytes('octopus')]); })
    .then(function (data) {
      var setupData = angular.toJson({
        key: '8cc5f0aa11ca47a9bb10d252b5f58b60',
        id: 'Octopus Setup Data',
        ssid: $scope.setupData.wifiSsid,
        wifipwd: $scope.setupData.wifiPwd,
        rootpwd: $scope.setupData.devicePwd,
        devicename: $scope.setupData.deviceName
      });
      var dataToSend = JSON.stringify(setupData).match(/.{1,20}/g);

      return writeData($scope.dev.id, octopusSvcId, setupDataCharacteristicsId, dataToSend, ble.write);
    })
    .then(function () { return asyncify(ble.write, [$scope.dev.id, octopusSvcId, setupDoneCharacteristicsId, stringToBytes('octopus')]); })
    .then(function () {
      $ionicLoading.hide();
      $ionicLoading.show({ template: '<ion-spinner></ion-spinner><span>&nbsp;Data written, waiting for response from ' + $scope.dev.name + ', please wait...</span>' });
      // If we got this far then all the config data was successfully written to Octopus through BLE
      // Now we have to wait for Octopus setup process to set up wifi and issue the notification that we registered in startNotification method
      // If the callback is not called within a minute something went wrong and we disconnect here
      var d = $q.defer();
      setTimeout(function () {
        if (!dataReceived) {
          timeout = true;
          d.reject('Notification from Octopus not received withing expected time frame');
        } else {
          d.resolve();
        }
      }, 75000);

      return d.promise;
    })
    .catch(function (err) {
      $ionicLoading.hide();
      $ionicPopup.alert({ title: 'Error', template: err });
    })
    .finally(function () {
      finalizeAndDisonnect();
    });
  };
})

.controller('DevicesCtrl', function ($scope, $stateParams, Devices, $q, $ionicPopup, $ionicLoading, $location, lodash, Network) {

  $scope.autorereshSec = 10;

  $scope.manualRefresh = function () {
    var devs = _.filter($scope.devices, function (d) { return d.status != 'checking'; });
    _.each(devs, function (d) { d.hartbeat = 0; });
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.devices = Devices.allRegistered();

  var viewActive = false;
  var refresh = function (device) {
    Network.test(device.ip)
    .then(function () { device.status = 'running'; device.statusColor = 'green'; })
    .catch(function (err) { device.status = 'not responding'; device.statusColor = 'red'; })
    .finally(function () { device.heartbeat = 10; });
  }

  var refresher = function () {
    var devs = _.filter($scope.devices, function (d) {
      return d.status != 'checking';
    });
    _.each(devs, function (d) {
      if (--d.heartbeat <= 0) {
        d.status = 'checking';
        d.statusColor = 'orange';
        refresh(d);
      }
    });

    // repeat
    if (viewActive) setTimeout(refresher, 1000);
  }

  $scope.$on('$ionicView.enter', function (scopes, states) {
    _.each($scope.devices, function (d) { d.hartbeat = 0; });
    viewActive = true;
    refresher();
  });

  $scope.$on('$ionicView.leave', function (scopes, states) {
    viewActive = false;
  });
})

.controller('DeviceCtrl', function ($scope, $stateParams, Devices, $q, $ionicPopup, $ionicLoading, $location, lodash, Network, $ionicGesture) {
  $scope.device = Devices.getRegistered($stateParams.devId);

  var element = angular.element(document.querySelector('#canvLightDial'));
  var canvas = document.getElementById('canvLightDial');

  var CircularSwitch = function (canvas, onRotate, outerRadius, circleWidth, minValue, maxValue, stepAngle, speedMultiplicator, color) {
    stepAngle = stepAngle || 15.0;
    circleWidth = circleWidth || Math.min(canvas.width, canvas.height) / 4.0;
    outerRadius = outerRadius || Math.min(canvas.width, canvas.height) / 2.0;
    var canvas = canvas;
    var context = canvas.getContext('2d');
    var centerX = canvas.width / 2.0;
    var centerY = canvas.height / 2.0;
    var outerRadius = outerRadius;
    var circleWidth = circleWidth;
    var innerRadius = outerRadius - circleWidth;
    var minValue = minValue || 0;
    var maxValue = maxValue || 100;
    var value = minValue;
    var speedMultiplicator = speedMultiplicator || 4.0;
    var foreColor = color || 'grey';
    var bkgColor = canvas.backgroundColor || 'white';
    var stepAngle = Math.abs(stepAngle % 360);
    var startAngle;
    var mouseDown = false, isDragging = false;
    var mouseDownPos;

    var onValueChange = function (delta, end) {
      delta = delta || 0.0;
      end = end || false;
      value = Math.min(maxValue, Math.max(minValue, value + delta * speedMultiplicator));
      if (onRotate && typeof (onRotate) == 'function') onRotate(value, end);
    };

    var getMousePos = function (evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.gesture.center.pageX - rect.left,
        y: evt.gesture.center.pageY - rect.top
      };
    };
    var onDragBegin = function (evt) {
      isDragging = false;
      mouseDownPos = getMousePos(evt);
      startAngle = getTouchAngle(mouseDownPos.x, mouseDownPos.y);
      mouseDown = isInDiscArea(mouseDownPos.x, mouseDownPos.y);
    };

    var onDragMove = function (evt) {
      if (mouseDown) {
        //console.log('drag');
        var touch = getMousePos(evt);
        if (!isInDiscArea(touch.x, touch.y)) {
          onDragEnd(evt);
        } else {
          var touchAngle = getTouchAngle(touch.x, touch.y, !isDragging);
          if (!isDragging) {
            value = ((maxValue - minValue) * touchAngle / 360.0) + minValue;
            isDragging = true;
            draw();
            onValueChange();
          } else {
            var deltaAngle = (360.0 + touchAngle - startAngle + 180.0) % 360.0 - 180.0;
            if (Math.abs(deltaAngle) > stepAngle) {
              var delta = deltaAngle / stepAngle;
              startAngle = touchAngle;
              draw();
              onValueChange(delta);
            }
          }
        }
      }
    };

    var onDragEnd = function (evt) {
      if (!isDragging && mouseDown) {
        var touch = getMousePos(evt);
        var touchAngle = getTouchAngle(touch.x, touch.y, true);
        value = ((maxValue - minValue) * touchAngle / 360.0) + minValue;
        draw();
        onValueChange(0, true);
      } else if (evt) {
        evt.preventDefault();
      }

      mouseDown = false;
    };

    var onTap = function (evt) {
      var touch = getMousePos(evt);
      if (isInDiscArea(touch.x, touch.y)) {
        var touchAngle = getTouchAngle(touch.x, touch.y, true);
        value = ((maxValue - minValue) * touchAngle / 360.0) + minValue;
        draw();
        onValueChange(0, true);
      }
      mouseDown = false;
    };

    var onDoubleTap = function (evt) {
      var touch = getMousePos(evt);
      if (isInDiscArea(touch.x, touch.y, true)) {
        if (value != maxValue) value = maxValue;
        else value = minValue;
        draw();
        onValueChange(0, true);
      }
      mouseDown = false;
    };

    var draw = function () {
      var gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.floor(outerRadius * 1.5));
      gradient.addColorStop(0, bkgColor);
      gradient.addColorStop(1, foreColor);
      context.beginPath();
      context.arc(centerX, centerY, outerRadius - (circleWidth / 2), 0, 2 * Math.PI, false);
      context.lineWidth = circleWidth;
      context.strokeStyle = gradient;
      context.stroke();
      context.closePath();
      var lineCount = 360.0 / stepAngle;
      var lineDelta = (maxValue - minValue) / lineCount;
      for (i = 0; i < Math.floor(lineCount) ; i++) {
        var color = value >= maxValue ? bkgColor : (value > i * lineDelta ? bkgColor : foreColor);
        var rad = Math.toRad(stepAngle * i - 90.0);
        var lineInnerRadius = Math.floor(innerRadius * 1.2);
        var lineOuterRadius = Math.floor(outerRadius * 0.9);
        startX = centerX + lineInnerRadius * Math.cos(rad);
        startY = centerY + lineInnerRadius * Math.sin(rad);
        stopX = centerX + lineOuterRadius * Math.cos(rad);
        stopY = centerY + lineOuterRadius * Math.sin(rad);
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(stopX, stopY);
        context.lineWidth = 2;
        context.strokeStyle = color;
        context.lineCap = 'round';
        context.stroke();
        context.closePath();
      }
    }

    var dragBeginEvt, dragMoveEvt, dragEndEvt, tapEvt, dblTapEvt;
    this.start = function () {
      // Register events
      // http://ionicframework.com/docs/api/utility/ionic.EventController/
      // http://ionicframework.com/docs/api/service/$ionicGesture/
      dragBeginEvt = $ionicGesture.on('dragstart', onDragBegin, element);
      dragMoveEvt = $ionicGesture.on('drag', onDragMove, element);
      dragEndEvt = $ionicGesture.on('dragend', onDragEnd, element);
      tapEvt = $ionicGesture.on('tap', onTap, element);
      dblTapEvt = $ionicGesture.on('doubletap', onTap, element);

      draw();
      onValueChange();
    };

    this.stop = function () {
      // Deregister events
      $ionicGesture.off(dragBeginEvt, 'dragstart', onDragBegin);
      $ionicGesture.off(dragMoveEvt, 'drag', onDragMove);
      $ionicGesture.off(dragEndEvt, 'dragend', onDragEnd);
      $ionicGesture.off(tapEvt, 'tap', onTap);
      $ionicGesture.off(dblTapEvt, 'doubletap', onDoubleTap);
    };

    this.getValue = function () { return value; }

    this.setValue = function (value) {
      value = Math.max(minValue, Math.min(maxValue, value));
      draw();
      onValueChange();
    };

    var getDistance = function (xA, yA, xB, yB) {
      var dx = Math.pow(xA - xB, 2),
          dy = Math.pow(yA - yB, 2);
      return Math.sqrt(dx + dy);
    };

    var isInDiscArea = function (touchX, touchY, fullCircle) {
      fullCircle = fullCircle || false;
      var distToCenter = getDistance(centerX, centerY, touchX, touchY);
      var result = (fullCircle || distToCenter >= innerRadius) && distToCenter <= outerRadius;
      return result;
    }

    var getTouchAngle = function (touchX, touchY, absolute) {
      absolute = absolute || false;
      var dX = touchX - centerX;
      var dY = centerY - touchY;
      var result = (270.0 - Math.degrees(Math.atan2(dY, dX))) % 360.0 - 180.0;
      if (absolute && result < 0) result += 360.0;
      return result;
    }
  };

  if (!Math.toRad || typeof (Math.toRad) === "undefined") {
    Math.toRad = function (deg) {
      return deg * Math.PI / 180.0;
    }
  }

  if (!Math.degrees || typeof (Math.degrees) === "undefined") {
    Math.degrees = function (rad) {
      return rad * 180.0 / Math.PI;
    }
  }

  var lastUpdateTimestamp = 0;
  var dialSwitch = new CircularSwitch(canvas, function (value, end) {
    var ctx = canvas.getContext('2d');
    ctx.font = "30pt Georgia";
    ctx.fillStyle = 'grey';
    ctx.clearRect(canvas.width * 2 / 6, canvas.height * 2 / 6, canvas.width * 2 / 6, canvas.height * 2 / 6);
    var text = Math.floor(value).toString() + "%";
    var textWidth = ctx.measureText(text).width, textHeight = 25; // same height as font size
    ctx.fillText(text, (canvas.width - textWidth) / 2, (canvas.height + textHeight) / 2);

    // Update Octopus value at the end of drag
    if (end) {
      Network.getLight($scope.device.ip, Math.floor(value))
      .then(function (data) { })
      .catch(function (e) { console.log(e); });
    }
  });

  dialSwitch.start(element);
  Network.getLight($scope.device.ip)
  .then(function (data) { dialSwitch.setValue(data); })
  .catch(function () { });
});
