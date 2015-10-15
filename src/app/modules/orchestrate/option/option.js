(function () {
    'use strict';

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateOptionController', orchestrateOptionController);

    function orchestrateOptionController($scope, $stateParams, orchestrateService, $compile, WS_URL, errorHandler) {
        var vm = this;

        vm.sendMessage = sendMessage;

        vm.title = $stateParams.opt;

        vm.formElements = [];

        var domain = $stateParams.id,
            instance = $stateParams.inst,
            opt = $stateParams.opt,
            optId = $stateParams.opt_id;

        if (optId == 'new') {
            $scope.$watch('$parent.$parent.vm.workflows', function() {
                if (!$scope.$parent.$parent.vm.workflows) {
                    return;
                }

                vm.workflow = $scope.$parent.$parent.vm.workflows.filter(function (workflow) {
                    return workflow.name == $stateParams.opt;
                })[0];

                console.log(vm.workflow);

                if (!vm.workflow) {
                    return;
                }

                for (var index in vm.workflow.default_input) {
                    var value = vm.workflow.default_input[index];
                    vm.formElements.push({
                        index: index,
                        value : value
                    })
                }
            });
        } else {
            orchestrateService.loadOption(domain, instance, opt, optId).then(
                function (response) {
                    vm.workflow = response.data;
                    for (var index in vm.workflow.context) {
                        var value = vm.workflow.context[index];
                        vm.formElements.push({
                            index: index,
                            value : value
                        });
                    }
                },
                function (response) {
                    vm.error = errorHandler.showError(response);

            });
        }

        function sendMessage() {
            $('#sendMessageButton').button('loading');

            if (!vm.workflow.model) {

                var data = {};

                for (var index in vm.workflow.default_input) {
                    data[index] = $('#input-' + index).val();
                }

                orchestrateService.loadLogUrl(vm.workflow.activate_url, data).then(
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
