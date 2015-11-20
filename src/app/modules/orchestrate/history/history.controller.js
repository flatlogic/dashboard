(function () {
    'use strict';

    angular
        .module('qorDash.orchestrate.domain.instance.history')
        .controller('OrchestrateHistoryController', orchestrateHistoryController);

    function orchestrateHistoryController($scope, resolvedHistory) {
        $scope.previousCalls = resolvedHistory;
    }
})();
