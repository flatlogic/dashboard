(function() {
    'use strict';

    var domainStatModule = angular.module('qorDash.widget.domain_stat')
        .directive('liveTile', liveTile);

    liveTile.$inject = ['$rootScope'];
    function liveTile($rootScope){
        return {
            restrict: 'C',
            link: function (scope, $el, attrs){
                $el.css('height', attrs.height).liveTile();

                // remove onResize timeouts if present
                scope.$on('$stateChangeStart', function(){
                    $el.liveTile("destroy", true);
                });
            }
        }
    };

    var domainStatController = angular.createAuthorizedController('DomainStatController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
        // TODO Load data from api
        var jsonInput = {
            "network" : {
                "vpc" : 1,
                "availability_zones": 3,
                "subnets" : 6,
                "security_groups" : 5
            },
            "resources" : {
                "hosts" : 25,
                "volumes" : 20,
                "ip_addresses" : 10,
                "load_balancers" :2
            },
            "containers" : {
                "all_time" : 7897,
                "running" : 578,
                "stopped" : 20,
                "failed" : 4
            },
            "process" : {
                "deployments" : 45,
                "rollbacks" : 3,
                "warnings" : 23,
                "errors" : 4
            }
        };

        var parseData = function(inputData) {
            var data = inputData;

            $scope.network      = data.network;
            $scope.resources    = data.resources;
            $scope.containers   = data.containers;
            $scope.process      = data.process;
        };

        parseData(jsonInput);
    }]);

    domainStatModule.controller(domainStatController);
})();