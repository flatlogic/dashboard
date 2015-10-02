(function () {
    'use strict';

    angular.module('qorDash.docker')
        .controller('DockerDomainController', domainController);

    domainController.$inject = ['$scope', '$stateParams', '$http', 'API_URL', 'errorHandler'];
    function domainController($scope, $stateParams, $http, API_URL, errorHandler) {
        var domainId = $stateParams.domain;

        $http.get(API_URL + '/v1/domain/' + domainId).then(
            function (response) {
                $scope.domain = response.data;
            },
            function (response) {
                $scope.error = errorHandler.showError(response.data, response.status);
            }
        );
    }

})();
