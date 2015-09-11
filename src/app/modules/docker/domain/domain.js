(function () {
    'use strict';

    angular.module('qorDash.docker')
        .controller('DockerDomainController', domainController);

    domainController.$inject = ['$scope', '$stateParams', '$http', 'API_URL', 'errorHandler'];
    function domainController($scope, $stateParams, $http, API_URL, errorHandler) {
        var domainId = $stateParams.id;

        $http.get(API_URL + '/v1/domain/' + domainId)
            .success(function (response, status, headers) {
                $scope.domain = response;
            })
            .error(function (e, code) {
                $scope.error = errorHandler.showError(e, code);
            });
    }

})();
