(function () {
    'use strict';

    angular.module('qorDash.orchestrate');

    orchestrateInstanceController.$inject = ['$scope', '$stateParams', '$http', 'orchestrateService', 'errorHandler'];
    function orchestrateInstanceController($scope, $stateParams, $http, orchestrateService, errorHandler) {

        $scope.title = $stateParams.inst;
        $scope.workflows = [];

        orchestrateService.loadInstances($stateParams.id, $stateParams.inst).then(
            function (response) {
                $scope.workflows = response.data;
            },
            function (response) {
                $scope.error = errorHandler.showError(response.data, response.status);
            }
        );
    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateInstanceController', orchestrateInstanceController);
})();
