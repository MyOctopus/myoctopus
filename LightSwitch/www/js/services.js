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
					this.post();
					localStorage.setItem("graduation", actualGraduation)
				},
				post : function() {
					$http.post('http://dadomagico.co.nf/postData.php', {
						graduation : actualGraduation
					}).success(function(data, status, headers, config) {
						console.log(data, status, headers, config);
					}).error(function(data, status, headers, config) {
						console.log(data, status, headers, config);
					});
				},
				getActual : function() {
					$http.get('http://dadomagico.co.nf/getActualData.php').success(function(data, status) {
						actualGraduation = data.graduation;
						console.log(data);
					}).error(function(data, status) {
						console.log(data);
					});
					this.save();
				}
			};
		})

		.factory(
				'Chart',
				function($http, $q) {
					var graph = {
						scaled : true,
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
									min : 0,
									max : 100
								},
							},
							series : [],
							lineMode : 'cardinal',
							tension : 0.7,
							drawLegend : true,
							drawDots : false,
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
						getScaled : function() {
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
								if (graph.data.length > 40)
									graph.data.shift();
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
							graph.options.axes.y.min = 0;
							graph.options.axes.y.max = 100;
							$http.get('http://dadomagico.co.nf/getData.php').success(function(data, status) {
								processSeries(data.sensors);
								processData(data.data, new Date(data.timestamp));
								defer.resolve(graph);
							}).error(function(data, status) {
								defer.resolve(graph);
							});
							return defer.promise;
						},
						get : function() {
							function processData(data, x) {
								var newData = {
									x : x
								};
								for (var i = 0; i < data.length; i++) {
									newData["sensor_" + data[i].sensor_id] = parseFloat(data[i].value);
								}
								if (graph.data.length > 40)
									graph.data.shift();
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
							delete graph.options.axes.y.min;
							delete graph.options.axes.y.max;
							$http.get('http://dadomagico.co.nf/getData.php').success(function(data, status) {
								processSeries(data.sensors);
								var time = new Date(data.timestamp);
								processData(data.data, new Date(data.timestamp));
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
						'tab.graph' : '<div class="sub-header"><i class="icon ion-ios-sunny"></i> Tap a sensor to display/hide it.</div><div class="sub-header"><i class="icon ion-ios-sunny"></i> Use the buttons on the bottom to change the graph.</div><div class="sub-header"><i class="icon ion-ios-sunny"></i> Use the toggle input to switch between scaled or not scaled data.</div><div class="sub-header"><i class="icon ion-ios-sunny"></i> If the scale is ON, hiding/displaying different sensors will make the scale change.</div>',
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
