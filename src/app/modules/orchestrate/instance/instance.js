(function() {
    'use strict';

    angular.module('qorDash.orchestrate')
        .value('domains', [
            {"id":"api.foo.com", "name":"Api", "url":"https://server.com/domain/api.foo.com" },
            {"id":"portal.foo.com", "name": "Portal", "url":"https://server.com/domain/portal.foo.com"}
        ])
    ;

    orchestrateInstanceController.$inject = ['$scope', '$stateParams', 'domains'];
    function orchestrateInstanceController($scope, $stateParams, domains) {

        $scope.title = $stateParams.inst;

        $scope.workflows = [
            {  "orchestration": "launch instances",
                "activate_url" : "https://server.com/v1/orchestrate/api.foo.com/production/launch_instances",
                "feed_url" : "https://server.com/v1/orchestrate/api.foo.com/production/launch_instances/feed",
                "input" : {
                    "instances" : { "type": "integer", "min" : 1, "max": 100 },
                    "subnet" : {"type" : "string", "default" : "us-west-a-private" },
                    "image" : { "type" : "string", "default" : "ntp-docker1.7-dockerhub-ami" }
                } },
            {  "orchestration": "run db migrate",
                "activate_url" : "https://server.com/v1/orchestrate/api.foo.com/production/run_db_migrate",
                "feed_url" : "https://server.com/v1/orchestrate/api.foo.com/production/run_db_migrate/feed",
                "input" : {
                    "image" : { "type" : "string", "default" : "blinker/blinker:master-1" }
                } }
        ];
    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateInstanceController', orchestrateInstanceController);
})();
