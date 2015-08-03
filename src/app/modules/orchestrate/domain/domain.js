(function () {
    'use strict';

    angular.module('qorDash.orchestrate');

    orchestrateDomainController.$inject = ['$scope', '$stateParams', '$http', 'API_URL'];
    function orchestrateDomainController($scope, $stateParams, $http, API_URL) {
        var domainId = $stateParams.id;

        $http.get(API_URL + '/v1/domain/' + domainId)
            .success(function (response, status, headers) {
                $scope.domain = response;
            })
            .error(function (response, status) {
                // TODO Add error message
            });
    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateDomainController', orchestrateDomainController);
})();
