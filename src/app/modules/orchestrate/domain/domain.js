(function () {
    'use strict';

    angular.module('qorDash.orchestrate');

    orchestrateDomainController.$inject = ['$scope', '$stateParams', 'errorHandler', 'domainLoader'];
    function orchestrateDomainController($scope, $stateParams, errorHandler, domainLoader) {
        domainLoader.load($stateParams.id).then(
            function (response) {
                $scope.domain = response.data;
            },
            function (response) {
                $scope.error = errorHandler.showError(response);
            }
        );
    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateDomainController', orchestrateDomainController);
})();
