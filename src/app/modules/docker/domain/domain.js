(function () {
    'use strict';

    angular.module('qorDash.docker')
        .controller('DockerDomainController', domainController);

    domainController.$inject = ['$scope', '$stateParams', 'errorHandler', 'domainLoader'];
    function domainController($scope, $stateParams, errorHandler, domainLoader) {
        domainLoader.load($stateParams.domain).then(
            function (response) {
                $scope.domain = response.data;
            },
            function (response) {
                $scope.error = errorHandler.showError(response);
            }
        );
    }

})();
