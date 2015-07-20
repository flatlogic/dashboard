(function() {
    'use strict';

    var domainStatModule = angular.module('qorDash.widget.domain_stat');

    var domainStatController = angular.createAuthorizedController('DomainStatController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
        // TODO Load data from api
        var jsonInput = {
            "services": {
                "nginx": {
                    "containers" : 1,
                    "cpu":  4,
                    "memory" : "4gb",
                    "disk"  : "10gb",
                    "image" : "blinker/nginx:95",
                    "config": "production/v1.1",
                    "git_commit" : "023dfe82a",
                    "last_update": 1435565762
                },
                "blinker": {
                    "containers" : 40,
                    "cpu":  160,
                    "memory" : "400gb",
                    "disk"  : "1000gb",
                    "image" : "blinker/blinker:prod",
                    "config": "production/v1.0",
                    "git_commit" : "23dfe878a",
                    "last_update": 1435565762
                },
                "sidekiq": {
                    "containers" : 20,
                    "cpu":  80,
                    "memory" : "200gb",
                    "disk"  : "500gb",
                    "image" : "blinker/blinker:prod",
                    "config": "production/v1.0",
                    "git_commit" : "23dfe878a",
                    "last_update": 1435565762
                },
                "clockwork": {
                    "containers" : 10,
                    "cpu":  40,
                    "memory" : "100gb",
                    "disk"  : "250gb",
                    "image" : "blinker/blinker:prod",
                    "config": "production/v1.0",
                    "git_commit" : "23dfe878a",
                    "last_update": 1435565762
                },
                "postgres": {
                    "containers" : 5,
                    "host" : 1,
                    "cpu":  16,
                    "memory" : "32gb",
                    "disk"  : "1000gb",
                    "version" : "postgres 9.4",
                    "config": "",
                    "git_commit" : "",
                    "last_update": 1435565762
                },
                "redis": {
                    "containers" : 1,
                    "cpu":  8,
                    "memory" : "100gb",
                    "disk"  : "250gb",
                    "image" : "blinker/redis-2.8",
                    "config": "production/v1.0",
                    "git_commit" : "",
                    "last_update": 1435565762
                },
                "memcached": {
                    "containers" : 4,
                    "cpu":  16,
                    "memory" : "400gb",
                    "disk"  : "250gb",
                    "image" : "blinker/memcached",
                    "config": "production/v1.0",
                    "git_commit" : "",
                    "last_update": 1435565762
                }
            },
            "infrastructure":  {
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
            }
        };

        var parseData = function(inputData) {
            var data = inputData;

            $scope.network      = data.infrastructure.network;
            $scope.resources    = data.infrastructure.resources;
            $scope.containers   = data.infrastructure.containers;
            $scope.process      = data.infrastructure.process;

            $scope.services = [];
            for (var index in inputData.services) {
                inputData.services[index].name = index;
                $scope.services.push(inputData.services[index]);
            }
        };

        parseData(jsonInput);

        $scope.getRandomCardColor = function() {
            var colors = ['purple', 'yellow', 'green', 'blue'];

            return colors[Math.floor(Math.random() * 4)];
        }
    }]);

    domainStatModule.controller(domainStatController);
})();