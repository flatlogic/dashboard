(function() {
    'use strict';

    angular.module('qorDash.orchestrate')
        .value('domains', [
            {"id":"api.foo.com", "name":"Api", "url":"https://server.com/domain/api.foo.com" },
            {"id":"portal.foo.com", "name": "Portal", "url":"https://server.com/domain/portal.foo.com"}
        ])
    ;

    orchestrateOptionController.$inject = ['$scope', '$stateParams', '$timeout'];
    function orchestrateOptionController($scope, $stateParams, $timeout) {

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

        for (var index in $scope.workflow.input) {
            var value = $scope.workflow.input[index];
            if (!value.default) {
                value.default = '';
            }
            switch (value.type) {
                case "string":
                    $('#dynamic-form').append('<div class="form-group" > ' +
                        '<label class="col-md-4 control-label" for="textinput">' + index + '</label>' +
                        '<div class="col-md-4">' +
                        '<input required="required" id="input-' + index + '" name="input-' + index + '" type="text" value="' + value.default + '" class="form-control input-md">' +
                        '</div>' +
                        '</div>');
                    break;
                case "integer":
                    $('#dynamic-form').append('<div class="form-group" > ' +
                        '<label class="col-md-4 control-label" for="textinput">' + index + '</label>' +
                        '<div class="col-md-4">' +
                        '<input required="required" id="input-' + index + '" name="input-' + index + '" type="text" value="' + value.default + '" class="form-control input-md">' +
                        '</div>' +
                        '</div>');
                    break;
                default:
                    break;
            }

            $scope.sendMessage = function() {
                $('#sendMessageButton').button('loading');

                $timeout(function(){
                    $('#sendMessageButton').button('reset');
                }, 2000);

                var data = {};

                for (var index in $scope.workflow.input) {
                    data[index] = $('#input-'+index).val();
                }

                // Make POST request to activete_url with data here
            }
        }
    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateOptionController', orchestrateOptionController);
})();
