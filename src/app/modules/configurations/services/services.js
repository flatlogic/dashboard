(function () {
    'use strict';

    angular.module('qorDash.configurations');

    servicesController.$inject = ['$scope', '$stateParams', '$http', 'API_URL'];
    function servicesController($scope, $stateParams, $http, API_URL) {
        var domainId = $stateParams.domain;

        $http.get(API_URL + '/v1/env/' + domainId + '/')
            .success(function (response, status, headers) {
                $scope.services = response;
            })
            .error(function (response, status) {
                // TODO Add error message
            });
    }

    angular.module('qorDash.configurations')
        .controller('ServicesController', servicesController);
})();
