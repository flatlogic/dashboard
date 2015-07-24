(function() {
    'use strict';

    angular.module('qorDash.orchestrate')
        .value('domains', [
            {"id":"api.foo.com", "name":"Api", "url":"https://server.com/domain/api.foo.com" },
            {"id":"portal.foo.com", "name": "Portal", "url":"https://server.com/domain/portal.foo.com"}
        ])
    ;

    orchestrateInstanceController.$inject = ['$scope', '$stateParams', '$http', 'API_URL'];
    function orchestrateInstanceController($scope, $stateParams, $http, API_URL) {

        $scope.title = $stateParams.inst;

        // TODO Change to Angular $http
        $http.get(API_URL + '/v1/orchestrate/blinker.com/ops-test/').success(function(data) {
            $scope.workflows = data;
        });

        $scope.workflows = [];
    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateInstanceController', orchestrateInstanceController);
})();
