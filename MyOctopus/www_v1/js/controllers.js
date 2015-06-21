angular
		.module('starter.controllers', [])

		.controller(
				'DashCtrl',
				function($scope, $ionicPopup, Light) {
					$scope.light = {
						turned : (Light.getGraduation() != 0)
					}
					$scope.lightStyle = function() {
						return {
							background : ($scope.light.turned ? "rgba(255,255,0,0.7)" : "rgba(100,100,100,0.7)"),
							'box-shadow' : "0 20px 100px " + ($scope.light.turned ? 25 : 0) + "px inset"
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
				})

		.controller('GradualCtrl', function($scope) {
		})

		.controller('GraphCtrl', function($scope) {
		});
