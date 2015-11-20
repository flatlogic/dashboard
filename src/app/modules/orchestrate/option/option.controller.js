(function () {
    'use strict';

    angular
        .module('qorDash.orchestrate')
        .controller('OrchestrateOptionController', orchestrateOptionController);

    function orchestrateOptionController($scope, $stateParams, orchestrateService, $compile, WS_URL, errorHandler) {

        $scope.title = $stateParams.opt;

        var getType = function (value) {
            return ({}).toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        };

        var domain = $stateParams.id,
            instance = $stateParams.inst,
            opt = $stateParams.opt,
            optId = $stateParams.opt_id;

        var getElement = function(value, index) {
            switch (getType(value)) {
                case "string":
                    return '<div class="form-group" > ' +
                        '<label class="col-md-4 control-label" for="input-' + index + '">' + index + '</label>' +
                        '<div class="col-md-4">' +
                        '<input required="required" id="input-' + index + '" name="input-' + index + '" type="text" value="' + value + '" class="form-control input-md">' +
                        '</div>' +
                        '</div>';
                    break;
                case "number":
                    return '<div class="form-group" > ' +
                        '<label class="col-md-4 control-label" for="input-' + index + '">' + index + '</label>' +
                        '<div class="col-md-4">' +
                        '<input required="required" id="input-' + index + '" name="input-' + index + '" type="text" value="' + value + '" class="form-control input-md">' +
                        '</div>' +
                        '</div>';
                    break;
                case "boolean":
                    var checked = value ? 'checked' : '';
                    return '<div class="form-group" > ' +
                        '<label class="col-md-4 control-label" for="input-' + index + '">' + index + '</label>' +
                        '<div class="col-md-4">' +
                        '<input class="new-checkbox" id="input-' + index + '" name="input-' + index + '" type="checkbox" ' + checked + '>' + '<label for="input-' + index + '"></label>' +
                        '</div>' +
                        '</div>';
                    break;
                default:
                    break;
            }
        };
        if (optId == 'new') {

            $scope.$watch('workflows', function() {
                if (!$scope.$parent.$parent.workflows) {
                    return;
                }

                $scope.workflow = $scope.$parent.$parent.workflows.filter(function (workflow) {
                    return workflow.name == $stateParams.opt;
                })[0];

                if (!$scope.workflow) {
                    return;
                }

                for (var index in $scope.workflow.default_input) {
                    var value = $scope.workflow.default_input[index];
                    $('#dynamic-form').append(getElement(value, index));
                }
            });
        } else {
            orchestrateService.loadOption(domain, instance, opt, optId).then(
                function (response) {
                    $scope.workflow = response.data;
                    for (var index in $scope.workflow.context) {
                        var value = $scope.workflow.context[index];
                        $('#dynamic-form').append(getElement(value, index));
                    }
                },
                function (response) {
                    $scope.error = errorHandler.showError(response);

            });
        }

        $scope.sendMessage = function () {
            $('#sendMessageButton').button('loading');

            if (!$scope.workflow.model) {

                var data = {};

                for (var index in $scope.workflow.default_input) {
                    data[index] = $('#input-' + index).val();
                }

                orchestrateService.loadLogUrl($scope.workflow.activate_url, data).then(
                    function (response) {
                        $('#timelineContainer').html($compile("<div ql-widget=\"Timeline\" ws-url=\"'" + WS_URL + response.data.log_ws_url + "'\"></div>")($scope));
                        $('#sendMessageButton').button('reset');
                    }
                );
            } else {
                var wsUrl = WS_URL + '/v1/ws/orchestrate/'+ domain +'/'+ instance +'/'+ opt +'/' + optId;
                $('#timelineContainer').html($compile("<div ql-widget=\"Timeline\" ws-url=\"'"+ wsUrl +"'\"></div>")($scope));
                $('#sendMessageButton').button('reset');
            }
        }
    }
})();
