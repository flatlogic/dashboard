(function () {
    'use strict';

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateHistoryController', orchestrateHistoryController);

    function orchestrateHistoryController($stateParams, orchestrateService, errorHandler) {
        var vm = this;

        orchestrateService.loadHistory($stateParams.id, $stateParams.inst, $stateParams.opt).then(
            function (response) {
                vm.previousCalls = response.data;
            },
            function(response){
                vm.error = errorHandler.showError(response);
            }
        );

    }
})();
