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

.controller('NetworkCtrl', function ($scope, Settings, $http, $ionicPopup) {
    $scope.address = { url: '' }
    $scope.error = { iserror: false, message: '' }
    $scope.testing = false;
    $scope.confirm = function () {
        // test if connection works
        $scope.testing = true;
        var address = 'http://'+ $scope.address.url + '/test';
        $http.get(address).success(function (data, status) {
            $scope.error.iserror = false;
            Settings.setNetwork($scope.address.url);
            $scope.testing = false;
            var alertPopup = $ionicPopup.alert({
                title: 'Test successful',
                template: 'Response: ' + data
            });
            alertPopup.then(function (res) {
            });
        }).error(function (data, status) {
            $scope.error.iserror = true;
            $scope.error.message = data;
            $scope.testing = false;
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
            address = '192.168.0.7:8080';
        $scope.address.url = address;
    }
    function leaving() {
        
    }

    //$scope.$watch("address.url", function (newValue, oldValue) {
    //    $scope.address.url = newValue;
    //});

    $scope.$on("$ionicView.enter", initialize);
    $scope.$on("$ionicView.leave", leaving);
});
