(function() {
    'use strict';

    angular.module('qorDash.orchestrate')
        .value('domains', [
            {"id":"api.foo.com", "name":"Api", "url":"https://server.com/domain/api.foo.com" },
            {"id":"portal.foo.com", "name": "Portal", "url":"https://server.com/domain/portal.foo.com"}
        ])
    ;

    orchestrateInstanceController.$inject = ['$scope', '$stateParams', '$http'];
    function orchestrateInstanceController($scope, $stateParams, $http) {

        $scope.title = $stateParams.inst;

        $scope.workflows = [{
            "name": "provision_instance",
            "label": "Provision minion instances",
            "description": "Starts new minion instance and add to the pool for a given environment",
            "activate_url": "/v1/orchestrate/ops-test.blinker.com/provision_instance",
            "default_input": {
                "image": "aws-ami-1234",
                "instances": 1,
                "type": "t1micro"
            }
        }, {
            "name": "blinker_db_migrate",
            "label": "Run db migration (blinker)",
            "description": "Run database migration for blinker",
            "activate_url": "/v1/orchestrate/ops-test.blinker.com/blinker_db_migrate",
            "default_input": {
                "retry": false
            }
        }, {
            "name": "blinker_build_image",
            "label": "Build Docker image (blinker)",
            "description": "Build docker image for blinker service",
            "activate_url": "/v1/orchestrate/ops-test.blinker.com/blinker_build_image",
            "default_input": {
                "git_branch": "develop",
                "git_repo": "git@github.com:BlinkerGit/test.git",
                "git_tag": "release1.0"
            }
        }];

        // TODO Load dynamic
    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateInstanceController', orchestrateInstanceController);
})();
