angular.module("myOctopusDMC")
    .controller('configurationController', function ($scope,$q,octopusDeviceService)
    {
        $scope.menu = { wifi: 'wifi', bluetooth: 'bluetooth', console: 'console' };
        $scope.activeMenu = $scope.menu.wifi;

        $scope.commands.openWifi = function(){
            $scope.activeMenu = $scope.menu.wifi;
        }
        $scope.commands.openBluetooth = function(){
            $scope.activeMenu = $scope.menu.bluetooth;
        }
        $scope.commands.openConsole = function(){
            $scope.activeMenu = $scope.menu.console;
        }
    });
