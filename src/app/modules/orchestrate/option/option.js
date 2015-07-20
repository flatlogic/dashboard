(function() {
    'use strict';

    angular.module('qorDash.orchestrate')
        .value('domains', [
            {"id":"api.foo.com", "name":"Api", "url":"https://server.com/domain/api.foo.com" },
            {"id":"portal.foo.com", "name": "Portal", "url":"https://server.com/domain/portal.foo.com"}
        ])
    ;

    orchestrateOptionController.$inject = ['$scope', '$stateParams', '$timeout', '$http'];
    function orchestrateOptionController($scope, $stateParams, $timeout, $http) {

        $scope.title = $stateParams.opt;

        var workflows = [
            {
                "name": "provision_instance",
                "label": "Provision minion instances",
                "description": "Starts new minion instance and add to the pool for a given environment",
                "activate_url": "/v1/orchestrate/ops-test.blinker.com/provision_instance",
                "default_input": {
                    "image": "aws-ami-1234",
                    "instances": 1,
                    "type": "t1micro"
                }
            },
            {
                "name": "blinker_db_migrate",
                "label": "Run db migration (blinker)",
                "description": "Run database migration for blinker",
                "activate_url": "/v1/orchestrate/ops-test.blinker.com/blinker_db_migrate",
                "default_input": {
                    "retry": false
                }
            },
            {
                "name": "blinker_build_image",
                "label": "Build Docker image (blinker)",
                "description": "Build docker image for blinker service",
                "activate_url": "/v1/orchestrate/ops-test.blinker.com/blinker_build_image",
                "default_input": {
                    "git_branch": "develop",
                    "git_repo": "git@github.com:BlinkerGit/test.git",
                    "git_tag": "release1.0"
                }
            }
        ];

        $scope.workflow = workflows.filter(function (workflow) {
            return workflow.name == $stateParams.opt;
        })[0];

        var getType = function(value) {
            return ({}).toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        };

        for (var index in $scope.workflow.default_input) {
            var value = $scope.workflow.default_input[index];

            switch (getType(value)) {
                case "string":
                    $('#dynamic-form').append('<div class="form-group" > ' +
                        '<label class="col-md-4 control-label" for="textinput">' + index + '</label>' +
                        '<div class="col-md-4">' +
                        '<input required="required" id="input-' + index + '" name="input-' + index + '" type="text" value="' + value + '" class="form-control input-md">' +
                        '</div>' +
                        '</div>');
                    break;
                case "number":
                    $('#dynamic-form').append('<div class="form-group" > ' +
                        '<label class="col-md-4 control-label" for="textinput">' + index + '</label>' +
                        '<div class="col-md-4">' +
                        '<input required="required" id="input-' + index + '" name="input-' + index + '" type="text" value="' + value + '" class="form-control input-md">' +
                        '</div>' +
                        '</div>');
                    break;
                case "boolean":
                    var checked = value ? 'checked': '';
                    $('#dynamic-form').append('<div class="form-group" > ' +
                        '<label class="col-md-4 control-label" for="textinput"></label>' +
                        '<div class="col-md-4">' +
                        '<input type="checkbox" '+ checked +'><h3 style="display: inline; margin-left: 10px;">' + index + '</h3>'+
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

                for (var index in $scope.workflow.default_input) {
                    data[index] = $('#input-'+index).val();
                }
            }
        }
    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateOptionController', orchestrateOptionController);
})();
