(function () {
    'use strict';

    angular.module('qorDash.orchestrate');

    orchestrateInstanceController.$inject = ['$scope', '$stateParams', '$http', 'API_URL', 'errorHandler'];
    function orchestrateInstanceController($scope, $stateParams, $http, API_URL, errorHandler) {

        $scope.title = $stateParams.inst;
        $scope.workflows = [];

        $http.get(API_URL + '/v1/orchestrate/'+ $stateParams.id +'/'+ $stateParams.inst +'/').success(function (data) {
            $scope.workflows = data;
        }).error(function (e, code) {
            $scope.error = errorHandler.showError(e, code);
        });
    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateInstanceController', orchestrateInstanceController);
})();
