angular.module("myOctopusDMC")
    .controller('dashboardController', function ($scope,$q,octopusDeviceService)
    {
        $scope.commands.refreshDashboard = function(){
             $scope.$broadcast('EVENT_dashboardRefresh');
        };
    });