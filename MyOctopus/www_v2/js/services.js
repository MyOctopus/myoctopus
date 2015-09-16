angular
		.module('starter.services', [])

		.factory('Light', function($http) {
			// Might use a resource here that returns a JSON array

			// Some fake testing data
			var actualGraduation = 0;
			if (localStorage.getItem("graduation") != null) {
				actualGraduation = localStorage.getItem("graduation");
				localStorage.setItem("graduation", actualGraduation)
			}

			return {
				isTurnedOn : function() {
					return (actualGraduation != 0);
				},
				switchLight : function() {
					if (actualGraduation != 0)
						actualGraduation = 0;
					else
						actualGraduation = 100;
					this.save();
					return actualGraduation;
				},
				graduate : function(graduation) {
					actualGraduation = graduation;
					this.save();
					return actualGraduation;
				},
				getGraduation : function() {
					return actualGraduation;
				},
				turnOff : function() {
					actualGraduation = 0;
					this.save();
					return actualGraduation;
				},
				turnOn : function() {
					actualGraduation = 100;
					this.save();
					return actualGraduation;
				},
				save : function() {
					localStorage.setItem("graduation", actualGraduation)
				},
				post : function() {
					$http.post('/someUrl', {
						graduation : actualGraduation
					}).success(function(data, status, headers, config) {
						console.log(data, status, headers, config);
					}).error(function(data, status, headers, config) {
						console.log(data, status, headers, config);
					});
				}
			};
		})

		.factory(
				'Chart',
				function($http, $q) {
					var graph = {
						options : {
							axes : {
								x : {
									key : 'x',
									type : 'date',
									ticksRotate : 15,
									ticks : 5
								},
								y : {
									type : 'linear',
									min: 0,
									max: 100
								},
							},
							series : [],
							lineMode : 'linear',
							tension : 0.7,
							drawLegend : true,
							drawDots : true,
							hideOverflow : false,
							columnsHGap : 5
						},
						data : [],
						maxs : [],
						mins : []
					}
					return {
						showOrHide : function(show) {
							for (var i = 0; i < graph.options.series.length; i++) {
								graph.options.series[i].visible = show;
							}
						},
						switchArea : function(type) {
							for (var i = 0; i < graph.options.series.length; i++) {
								graph.options.series[i].type = type;
							}
						},
						reset : function() {
							graph.data = [];
							return graph;
						},
						getScaled : function(date) {
							function processData(data, x) {
								var newData = {
									x : x
								};
								for (var i = 0; i < data.length; i++) {
									scale = (100) / (graph.maxs[i] - graph.mins[i]);
									new_value = (parseFloat(data[i].value) - graph.mins[i]) * scale;
									newValue = (((parseFloat(data[i].value) - graph.mins[i]) * (100)) / (graph.maxs[i] - graph.mins[i]))
									newData["sensor_" + data[i].sensor_id] = newValue;
								}
								graph.data.push(newData)
							}
							function processSeries(sensors) {
								var newSensor = (graph.options.series.length != sensors.length);
								var newSeries = [];
								for (var i = 0; i < sensors.length; i++) {
									graph.maxs[i] = parseFloat(sensors[i].max);
									graph.mins[i] = parseFloat(sensors[i].min);
									newSeries
											.push({
												y : "sensor_" + sensors[i].id,
												visible : (!newSensor && graph.options.series.length != 0 ? graph.options.series[i].visible
														: true),
												thickness : '2px',
												type : (!newSensor && graph.options.series.length != 0 ? graph.options.series[i].type
														: 'area'),
												striped : false,
												label : sensors[i].name
											})

								}
								graph.options.series = newSeries;
							}
							var defer = $q.defer();
							$http.get('js/data2.json').success(function(data, status) {
								data = data[date % 8];
								processSeries(data.sensors);
								var time = new Date(data.timestamp);
								processData(data.data, new Date(time.getTime() + (86400000 * date)));
								defer.resolve(graph);
							}).error(function(data, status) {
								defer.resolve(graph);
							});
							return defer.promise;
						},
						get : function(date) {
							function processData(data, x) {
								var newData = {
									x : x
								};
								for (var i = 0; i < data.length; i++) {
									newData["sensor_" + data[i].sensor_id] = parseFloat(data[i].value);
								}
								graph.data.push(newData)
							}
							function processSeries(sensors) {
								var newSensor = (graph.options.series.length != sensors.length);
								var newSeries = [];
								for (var i = 0; i < sensors.length; i++) {
									newSeries
											.push({
												y : "sensor_" + sensors[i].id,
												visible : (!newSensor && graph.options.series.length != 0 ? graph.options.series[i].visible
														: true),
												thickness : '2px',
												type : (!newSensor && graph.options.series.length != 0 ? graph.options.series[i].type
														: 'area'),
												striped : false,
												label : sensors[i].name
											})

								}
								graph.options.series = newSeries;
							}
							var defer = $q.defer();
							$http.get('js/data.json').success(function(data, status) {
								data = data[date % 8];
								processSeries(data.sensors);
								var time = new Date(data.timestamp);
								processData(data.data, new Date(time.getTime() + (86400000 * date)));
								defer.resolve(graph);
							}).error(function(data, status) {
								defer.resolve(graph);
							});
							return defer.promise;
						}
					}
				})

		.factory(
				'Help',
				function($ionicPlatform, $ionicHistory) {
					var helps = {
						'tab.dash' : '<div class="sub-header"><i class="icon ion-ios-sunny"></i> Double tap to toggle.</div><div class="sub-header"><i class="icon ion-ios-sunny"></i> Swipe left/right to turn on or off respectively.</div><div class="sub-header"><i class="icon ion-ios-sunny"></i> Or use the toggle button.</div>',
						'tab.graph' : '<div class="sub-header"><i class="icon ion-ios-sunny"></i> Tap a sensor to display/hide it.</div><div class="sub-header"><i class="icon ion-ios-sunny"></i> Use the buttons on the bottom to change the graph.</div><div class="sub-header"><i class="icon ion-ios-sunny"></i> Hiding/displaying different sensors will make the scale change.</div>',
						'tab.gradual' : '<div class="sub-header"><i class="icon ion-ios-sunny"></i> Use the range input to graduate your light.</div><div class="sub-header"><i class="icon ion-ios-sunny"></i> Swipe left/right to add or substract 10% respectively.</div>'
					}
					return {
						getActual : function() {
							var actual;
							$ionicPlatform.ready(function() {
								actual = helps[$ionicHistory.currentView().stateId]
							})
							return actual;
						},
						get : function(id) {
							return helps[id]
						}
					}
				});
