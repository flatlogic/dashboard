(function () {
    'use strict';

    angular
        .module('qorDash.orchestrate')
        .controller('OrchestrateInstanceController', orchestrateInstanceController);

    function orchestrateInstanceController($scope, $stateParams, orchestrateService, errorHandler) {

        $scope.title = $stateParams.inst;
        $scope.workflows = [];

        orchestrateService.loadInstances($stateParams.id, $stateParams.inst).then(
            function (response) {
                $scope.workflows = response.data;
            },
            function (response) {
                $scope.error = errorHandler.showError(response);
            }
        );
    }
})();
