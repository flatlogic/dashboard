(function () {
    'use strict';

    angular.module('qorDash.orchestrate');

    orchestrateDomainController.$inject = ['$scope', '$stateParams', '$http', 'API_URL', 'errorHandler'];
    function orchestrateDomainController($scope, $stateParams, $http, API_URL, errorHandler) {
        var domainId = $stateParams.id;

        $http.get(API_URL + '/v1/domain/' + domainId).then(
            function (response) {
                $scope.domain = response.data;
            },
            function (response) {
                $scope.error = errorHandler.showError(response.data, response.status);
            }
        );
    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateDomainController', orchestrateDomainController);
})();
