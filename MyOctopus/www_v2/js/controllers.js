angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Light) {
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
				// $scope.swipeChange($scope.light.graduation)
				// $scope.light.graduation =
				// Math.round(parseInt($scope.light.graduation) / 10) * 10;
				$scope.light.graduation = Light.graduate(parseInt($scope.light.graduation));
			});
			$scope.$on("$ionicView.enter", initialize);
		})

.controller('GraphCtrl', function($scope, $interval, Chart) {
	$scope.graph = {};
	var count = 0;
	var interval;
	function initialize() {
		interval = $interval(function() {
			count++;
			Chart.getScaled(count).then(function(data) {
				$scope.graph = data;
			});
		}, 2000);
	}
	function leaving(){
		$interval.cancel(interval);
	}
	$scope.resetGraph = function(){
		Chart.reset();
	}
	$scope.showHideGraph = function(show){
		Chart.showOrHide(show);
	}
	$scope.switchArea = function(type){
		Chart.switchArea(type);
	}
	$scope.$on("$ionicView.enter", initialize);
	$scope.$on("$ionicView.leave", leaving);
});
