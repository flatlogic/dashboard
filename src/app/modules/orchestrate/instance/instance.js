(function () {
    'use strict';

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateInstanceController', orchestrateInstanceController);

    function orchestrateInstanceController($stateParams, orchestrateService, errorHandler) {
        var vm = this;

        vm.title = $stateParams.inst;
        vm.workflows = [];

        orchestrateService.loadInstances($stateParams.id, $stateParams.inst).then(
            function (response) {
                vm.workflows = response.data;
            },
            function (response) {
                vm.error = errorHandler.showError(response);
            }
        );
    }
})();
