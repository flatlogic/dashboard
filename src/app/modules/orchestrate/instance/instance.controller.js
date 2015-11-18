(function () {
    'use strict';

    angular
        .module('qorDash.orchestrate')
        .controller('OrchestrateInstanceController', orchestrateInstanceController);

    function orchestrateInstanceController($scope, $stateParams, resolvedInstances) {
        $scope.title = $stateParams.inst;
        $scope.workflows = resolvedInstances;
    }
})();
