angular.module("myOctopusDMC", ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider,$httpProvider, $injector) {
        $stateProvider
            .state('dashboard', {
            templateUrl: "dashboard/dashboard.html",
            authorize: false
        })
            .state('sensors', {
            templateUrl: "sensors/sensors.html",
            authorize: false
        })
            .state('configuration', {
            templateUrl: "configuration/configuration.html",
            authorize: false
        });
    })
    .controller('shellController', function($scope,$state){
        $scope.commands = {};
        $scope.commands.showDashboard = function(){
            $state.go("dashboard");
        };
        $scope.commands.showSensors = function(){
            $state.go("sensors");
        };
        $scope.commands.showConfiguration = function(){
            $state.go("configuration");
        };
        $scope.commands.showConfiguration_wifi = function(){
            $state.go("configuration_wifi");
        };
        $scope.commands.showConfiguration_bluetooth = function(){
            $state.go("configuration_bluetooth");
        };

        $state.go("dashboard");
    })
    .factory('notificationsService', function($http) {
        var service = {};
        service.failed = function (caption, message) {
            toastr.options.timeOut = 2000;
            toastr.warning(message, caption);
        };
        service.success = function (caption, message) {
            toastr.success(message, caption);
        };
        return service;
    })
    .factory('errorsService', function($http) {
        var service = {};

        return service;
    })
    .factory('interactionsService', function($http) {
        var service = {};

        return service;
    })
    .factory('logService', function($http) {
        var service = {};

        return service;
    });