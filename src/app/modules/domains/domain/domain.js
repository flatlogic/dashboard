(function () {
    'use strict';

    angular.module('qorDash.domains')
        .controller('DomainController', domainController);

    domainController.$inject = ['$scope', '$stateParams', 'errorHandler', 'domainLoader'];
    function domainController($scope, $stateParams, errorHandler, domainLoader) {
        domainLoader.load($stateParams.id).then(
            function (response) {
                $scope.domain = response.data;
            },
            function (response) {
                $scope.error = errorHandler.showError(response.data, response.status);
            }
        );
    }

})();
