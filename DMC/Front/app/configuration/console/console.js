angular.module("myOctopusDMC")
    .directive('console',function() {
        return {
            replace: 'true',
            templateUrl: "app/configuration/console/console.html"
        };
    });