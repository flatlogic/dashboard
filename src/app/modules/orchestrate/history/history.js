(function () {
    'use strict';

    angular.module('qorDash.orchestrate');

    orchestrateHistoryController.$inject = ['$scope', '$stateParams', 'orchestrateService', 'errorHandler'];
    function orchestrateHistoryController($scope, $stateParams, orchestrateService, errorHandler) {
        orchestrateService.loadHistory($stateParams.id, $stateParams.inst, $stateParams.opt).then(
            function (response) {
                $scope.previousCalls = response.data;
            },
            function(response){
                $scope.error = errorHandler.showError(response.data, response.status);
            }
        );

    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateHistoryController', orchestrateHistoryController);
})();
