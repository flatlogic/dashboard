(function() {
    'use strict';

    angular.module('qorDash.orchestrate')
        .value('domains', [
            {"id":"api.foo.com", "name":"Api", "url":"https://server.com/domain/api.foo.com" },
            {"id":"portal.foo.com", "name": "Portal", "url":"https://server.com/domain/portal.foo.com"}
        ])
    ;

    orchestrateOptionController.$inject = ['$scope', '$stateParams', '$timeout', '$http', 'API_URL', '$compile'];
    function orchestrateOptionController($scope, $stateParams, $timeout, $http, API_URL, $compile) {

        $scope.title = $stateParams.opt;

        $scope.workflow = $scope.workflows.filter(function (workflow) {
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
                        '<label class="col-md-4 control-label" for="input-'+index+'">' + index + '</label>' +
                        '<div class="col-md-4">' +
                        '<input required="required" id="input-' + index + '" name="input-' + index + '" type="text" value="' + value + '" class="form-control input-md">' +
                        '</div>' +
                        '</div>');
                    break;
                case "number":
                    $('#dynamic-form').append('<div class="form-group" > ' +
                        '<label class="col-md-4 control-label" for="input-'+index+'">' + index + '</label>' +
                        '<div class="col-md-4">' +
                        '<input required="required" id="input-' + index + '" name="input-' + index + '" type="text" value="' + value + '" class="form-control input-md">' +
                        '</div>' +
                        '</div>');
                    break;
                case "boolean":
                    var checked = value ? 'checked': '';
                    $('#dynamic-form').append('<div class="form-group" > ' +
                        '<label class="col-md-4 control-label" for="input-'+index+'">'+index+'</label>' +
                        '<div class="col-md-4">' +
                        '<input class="new-checkbox" id="input-' + index + '" name="input-' + index + '" type="checkbox" '+ checked +'>'+ '<label for="input-'+index+'"></label>' +
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
//
//                var request = {
//                    type: 'POST',
//                    url:    API_URL + $scope.workflow.activate_url,
//                    headers: {
//                        'Content-Type': 'application/json'
//                    },
//                    data: data
//                };
//
//                $.ajax(request)
//                    .done(function(response) {
//                        debugger;
//                    });

                $('#timelineContainer').append($compile('<div ql-widget="Timeline" ws-url="ws://52.24.70.156/v1/ws/run/timeline1"></div>')($scope));
            }
        }
    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateOptionController', orchestrateOptionController);
})();
