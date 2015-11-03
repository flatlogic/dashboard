(function () {
    'use strict';

    angular.module('qorDash.orchestrate');

    orchestrateInstanceController.$inject = ['$scope', '$stateParams', 'orchestrateService', 'errorHandler'];
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

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateInstanceController', orchestrateInstanceController);
})();
