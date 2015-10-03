(function () {
    'use strict';

    angular.module('qorDash.orchestrate');

    orchestrateDomainController.$inject = ['$scope', '$stateParams', '$http', 'API_URL', 'errorHandler', 'domainLoader'];
    function orchestrateDomainController($scope, $stateParams, $http, API_URL, errorHandler, domainLoader) {
        domainLoader.load($stateParams.id).then(
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
