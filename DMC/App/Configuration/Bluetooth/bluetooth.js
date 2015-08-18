angular.module("myOctopusDMC")
    .directive('bluetooth',function() {
        return {
            replace: 'true',
            templateUrl: "configuration/bluetooth/bluetooth.html",
            controller: function($scope){
                $scope.isBluetoothEnabled = false;
                $scope.commands.enableBluetooth = function () {

                };
                $scope.commands.disableBluetooth = function(){

                };
            }
        };
    });