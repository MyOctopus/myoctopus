
angular
		.module('starter', [ 'ionic', 'starter.controllers', 'starter.services' ])

		.run(
				function($ionicPlatform, $rootScope, $ionicPopup) {
					$ionicPlatform
							.ready(function() {
								$rootScope.showPopup = function() {
									var myPopup = $ionicPopup
											.alert({
												template : '<div class="sub-header"><i class="icon ion-ios-sunny"></i> Double tap to toggle.</div><div class="sub-header"><i class="icon ion-ios-sunny"></i> Swipe left/right to turn on or off respectively.</div><div class="sub-header"><i class="icon ion-ios-sunny"></i> Or use the toggle button.</div>',
												title : 'How to ...?',
												okType: "button-energized",
												okText : "Cerrar"
											});
								}
								// Hide the accessory bar by default (remove
								// this to show the accessory bar above the
								// keyboard
								// for form inputs)
								if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
									cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
								}
								if (window.StatusBar) {
									// org.apache.cordova.statusbar required
									StatusBar.styleLightContent();
								}
							});
				})

		.config(function($stateProvider, $urlRouterProvider) {

			// Ionic uses AngularUI Router which uses the concept of states
			// Learn more here: https://github.com/angular-ui/ui-router
			// Set up the various states which the app can be in.
			// Each state's controller can be found in controllers.js
			$stateProvider

			// setup an abstract state for the tabs directive
			.state('tab', {
				url : "/tab",
				abstract : true,
				templateUrl : "templates/tabs.html"
			})

			// Each tab has its own nav history stack:

			.state('tab.dash', {
				url : '/dash',
				views : {
					'tab-dash' : {
						templateUrl : 'templates/tab-dash.html',
						controller : 'DashCtrl'
					}
				}
			})

			.state('tab.gradual', {
				url : '/gradual',
				views : {
					'tab-gradual' : {
						templateUrl : 'templates/tab-gradual.html',
						controller : 'GradualCtrl'
					}
				}
			})

			.state('tab.gaph', {
				url : '/graph',
				views : {
					'tab-graph' : {
						templateUrl : 'templates/tab-graph.html',
						controller : 'GraphCtrl'
					}
				}
			});

			// if none of the above states are matched, use this as the fallback
			$urlRouterProvider.otherwise('/tab/dash');

		});
