(function () {
    'use strict';

    var orchestrateController = angular.createAuthorizedController('OrchestrateController', ['$scope', '$stateParams', '$http', 'API_URL', function ($scope, $stateParams, $http, API_URL) {
        $http.get(API_URL + '/v1/domain/')
            .success(function (response, status, headers) {
                $scope.domains = response;

                $scope.domain = $scope.domains.filter(function (domain) {
                    return domain.id == $stateParams.id;
                })[0];
            })
            .error(function (response, code) {
                // TODO Add error message
            });
    }]);

    angular.module('qorDash.orchestrate')
        .controller(orchestrateController);

})();
