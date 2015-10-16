(function () {
    'use strict';

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateOptionController', orchestrateOptionController);

    function orchestrateOptionController($scope, $stateParams, orchestrateService, $timeout, WS_URL, errorHandler) {
        var vm = this;

        vm.sendMessage = sendMessage;

        vm.title = $stateParams.opt;

        vm.formElements = {};

        //TODO Use button loading directive
        vm.sendMessageButtonLoadingState = false;
        vm.timeLineUrl = '';

        var domain = $stateParams.id,
            instance = $stateParams.inst,
            opt = $stateParams.opt,
            optId = $stateParams.opt_id;

        loadOption();

        function loadOption() {
            vm.formElements = {};

            if (optId == 'new') {
                if (!$scope.$parent.$parent.vm.workflows || $scope.$parent.$parent.vm.workflows.length === 0) {
                    $scope.$watch('$parent.$parent.vm.workflows', function() {
                        if ($scope.$parent.$parent.vm.workflows) {
                            loadFormElementsFromWorkflow();
                        }
                    });
                } else {
                    loadFormElementsFromWorkflow();
                }

            } else {
                orchestrateService.loadOption(domain, instance, opt, optId).then(
                    function (response) {
                        vm.workflow = response.data;
                        for (var index in vm.workflow.context) {
                            vm.formElements[index] = vm.workflow.context[index];
                        }
                    },
                    function (response) {
                        vm.error = errorHandler.showError(response);
                    });
            }
        }

        function loadFormElementsFromWorkflow() {
            vm.workflow = $scope.$parent.$parent.vm.workflows.filter(function (workflow) {
                return workflow.name == $stateParams.opt;
            })[0];

            if (!vm.workflow) {
                return;
            }
            var objToAdd = {};
            for (var index in vm.workflow.default_input) {
                objToAdd[index] = vm.workflow.default_input[index];
            }
            $timeout(function() {
                $scope.$apply(function () {
                    vm.formElements = objToAdd;
                });
            });
        }

        function sendMessage() {
            vm.sendMessageButtonLoadingState = true;

            if (!vm.workflow.model) {
                var data = {};

                for (var index in vm.workflow.default_input) {
                    data[index] = vm.formElements[index]
                }
                orchestrateService.loadLogUrl(vm.workflow.activate_url, data).then(
                    function (response) {
                        vm.timeLineUrl = WS_URL + response.data.log_ws_url;
                        vm.sendMessageButtonLoadingState = false;
                    }
                );
            } else {
                vm.timeLineUrl = WS_URL + '/v1/ws/orchestrate/'+ domain +'/'+ instance +'/'+ opt +'/' + optId;
                vm.sendMessageButtonLoadingState = false;
            }
        }
    }
})();
