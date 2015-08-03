(function () {
    'use strict';

    angular.module('qorDash.orchestrate');

    orchestrateInstanceController.$inject = ['$scope', '$stateParams', '$http', 'API_URL'];
    function orchestrateInstanceController($scope, $stateParams, $http, API_URL) {

        $scope.title = $stateParams.inst;

        // TODO Change to Angular $http
        $http.get(API_URL + '/v1/orchestrate/'+ $stateParams.id +'/'+ $stateParams.inst +'/').success(function (data) {
            $scope.workflows = data;
        });

        $scope.workflows = [];
    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateInstanceController', orchestrateInstanceController);
})();
