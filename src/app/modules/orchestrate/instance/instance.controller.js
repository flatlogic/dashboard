(function () {
    'use strict';

    angular
        .module('qorDash.orchestrate.domain.instance')
        .controller('OrchestrateInstanceController', orchestrateInstanceController);

    function orchestrateInstanceController($scope, $stateParams, resolvedInstances) {
        $scope.title = $stateParams.inst;
        $scope.workflows = resolvedInstances;
    }
})();
