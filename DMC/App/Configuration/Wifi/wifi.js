angular.module("myOctopusDMC")
    .directive('wifi',function() {
        return {
            replace: 'true',
            templateUrl: "configuration/wifi/wifi.html",
            controller: function($scope){
                $scope.isWifiEnabled = false;
                $scope.isWifiConnected = false;
                $scope.connectedNetwork = '';
                $scope.availableNetworks = [];
                $scope.commands.disconnectNetwork = function(){

                };
                $scope.commands.enableWifi = function () {

                };
                $scope.commands.disableWifi = function(){

                };
                $scope.commands.refreshAvailableNetworks = function(){
                    $scope.availableNetworks = ['Network A','Network B','Network C'];
                };
                $scope.commands.connectToNetwork = function(network){

                };
            }
        };
    });