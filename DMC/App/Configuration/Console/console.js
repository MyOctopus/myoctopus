angular.module("myOctopusDMC")
    .directive('console',function() {
        return {
            replace: 'true',
            templateUrl: "configuration/console/console.html"
        };
    });