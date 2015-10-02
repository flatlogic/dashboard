(function () {
    'use strict';

    angular.module('qorDash.orchestrate');

    orchestrateHistoryController.$inject = ['$scope', '$stateParams', '$http', 'API_URL', 'errorHandler'];
    function orchestrateHistoryController($scope, $stateParams, $http, API_URL, errorHandler) {

        var domain = $stateParams.id;
        var instance = $stateParams.inst;
        var option = $stateParams.opt;

        $http.get(API_URL + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/').then(
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
