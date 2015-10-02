(function () {
    'use strict';

    angular.module('qorDash.orchestrate');

    orchestrateInstanceController.$inject = ['$scope', '$stateParams', '$http', 'API_URL', 'errorHandler'];
    function orchestrateInstanceController($scope, $stateParams, $http, API_URL, errorHandler) {

        $scope.title = $stateParams.inst;
        $scope.workflows = [];

        $http.get(API_URL + '/v1/orchestrate/'+ $stateParams.id +'/'+ $stateParams.inst +'/').then(
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
