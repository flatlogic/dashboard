(function () {
    'use strict';

    angular
        .module('qorDash.orchestrate')
        .controller('OrchestrateHistoryController', orchestrateHistoryController);

    function orchestrateHistoryController($scope, resolvedHistory) {
        $scope.previousCalls = resolvedHistory;
    }
})();
