(function () {
    'use strict';

    angular.module('qorDash.orchestrate');

    orchestrateHistoryController.$inject = ['$scope', '$stateParams', '$http', 'API_URL'];
    function orchestrateHistoryController($scope, $stateParams, $http, API_URL) {

        var domain = $stateParams.id;
        var instance = $stateParams.inst;
        var option = $stateParams.opt;

        $http.get(API_URL + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/').success(function (data) {
            $scope.previousCalls = data;
        });
    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateHistoryController', orchestrateHistoryController);
})();
