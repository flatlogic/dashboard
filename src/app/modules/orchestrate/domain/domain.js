(function () {
    'use strict';

    angular.module('qorDash.orchestrate');

    orchestrateDomainController.$inject = ['$scope', '$stateParams', '$http', 'API_URL', 'errorHandler'];
    function orchestrateDomainController($scope, $stateParams, $http, API_URL, errorHandler) {
        var domainId = $stateParams.id;

        $http.get(API_URL + '/v1/domain/' + domainId)
            .success(function (response, status, headers) {
                $scope.domain = response;
            })
            .error(function (e, code) {
                $scope.error = errorHandler.showError(e, code);
            });
    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateDomainController', orchestrateDomainController);
})();
