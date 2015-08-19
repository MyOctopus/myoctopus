//multi request -handle
//layout
//date time - more crossbrowser
//highcharts -> highstocks with slider
//refresh - recreate ( depends on particular component )
//auto refresh on enter

angular.module("myOctopusDMC")
    .controller('sensorsController', function ($scope,$q,octopusDeviceService) {
        $scope.isChart = true;
        $scope.activeSensor = Octopus.sensors.temperature;
        $scope.sensorData = {};

        $scope.commands.showSensor_temperature = function(){
            $scope.activeSensor = Octopus.sensors.temperature;
            $scope.refreshData();
        };
        $scope.commands.showSensor_humidity = function(){
            $scope.activeSensor = Octopus.sensors.humidity;
            $scope.refreshData();
        };
        $scope.commands.showSensor_light = function(){
            $scope.activeSensor = Octopus.sensors.light;
            $scope.refreshData();
        };
        $scope.commands.showSensor_pressure = function(){
            $scope.activeSensor = Octopus.sensors.pressure;
            $scope.refreshData();
        };
        $scope.commands.sensors_showTable = function(){
            $scope.isChart = false;
        };
        $scope.commands.sensors_showChart = function(){
            $scope.isChart = true;
        };
        $scope.commands.sensors_refreshData = function(){

            var filter = {};
            filter.sensor = $scope.activeSensor;
            filter.from = $scope.filter_from;
            filter.to = $scope.filter_to;
            $scope.lockForLoading();
            octopusDeviceService.getSensorsHistoricValues(filter).then(function(results){
                $scope.sensorData = results.data;
                $scope.unlockForLoading();
            }, function(error) {

                $scope.unlockForLoading();
            });
        };

        //loading animation
        $scope.lockForLoading = function(){
            NProgress.configure({ parent: '#s_middle' });
            NProgress.start();
        };
        $scope.unlockForLoading = function(){
            NProgress.done();
        };
        $scope.refreshData = function(){
            $scope.commands.sensors_refreshData();
        };

        //dates
        $scope.getCurrentDate = function(){
            return new Date();
        };
        $scope.getCurrentDate_midnightOne  = function(){
            var date = new Date();
            date.setHours(0,0, 0,0);
            return date;
        };
        $scope.filter_from = $scope.getCurrentDate_midnightOne();
        $scope.filter_to = $scope.getCurrentDate();

    })
    .directive('schart',function($q, octopusDeviceService) {
        return function (scope, element, attr) {
            //we need different charts, for different sensors
            element.highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Monthly Average Temperature'
                },
                subtitle: {
                    text: 'Source: WorldClimate.com'
                },
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: 'Serie',
                    data: scope.sensorData
                }]
            });
        };
    })
    .directive('stable',function($q, octopusDeviceService) {
        return function (scope, element, attr) {
            var table = $('<table><thead><tr><th>Date</th><th>Value</th></tr></thead></table>');
            element.append(table);
            table.dataTable({
                data: scope.sensorData
            });
        };
    });