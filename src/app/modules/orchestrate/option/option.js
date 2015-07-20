(function() {
    'use strict';

    angular.module('qorDash.orchestrate')
        .value('domains', [
            {"id":"api.foo.com", "name":"Api", "url":"https://server.com/domain/api.foo.com" },
            {"id":"portal.foo.com", "name": "Portal", "url":"https://server.com/domain/portal.foo.com"}
        ])
    ;

    orchestrateOptionController.$inject = ['$scope', '$stateParams'];
    function orchestrateOptionController($scope, $stateParams) {

        $scope.title = $stateParams.opt;

        var workflows = [
            {  "orchestration": "launch instances",
                "activate_url" : "https://server.com/v1/orchestrate/api.foo.com/production/launch_instances",
                "feed_url" : "ws://52.24.70.156/v1/ws/run/timeline1",
                "input" : {
                    "instances" : { "type": "integer", "min" : 1, "max": 100 },
                    "subnet" : {"type" : "string", "default" : "us-west-a-private" },
                    "image" : { "type" : "string", "default" : "ntp-docker1.7-dockerhub-ami" }
                } },
            {  "orchestration": "run db migrate",
                "activate_url" : "https://server.com/v1/orchestrate/api.foo.com/production/run_db_migrate",
                "feed_url" : "ws://52.24.70.156/v1/ws/run/timeline1",
                "input" : {
                    "image" : { "type" : "string", "default" : "blinker/blinker:master-1" }
                } }
        ];

        $scope.workflow = workflows.filter(function (workflow) {
            return workflow.orchestration == $stateParams.opt;
        })[0];


    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateOptionController', orchestrateOptionController);
})();
