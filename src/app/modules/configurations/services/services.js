(function () {
    'use strict';

    angular.module('qorDash.configurations');

    servicesController.$inject = ['$scope', '$stateParams', '$http'];
    function servicesController($scope, $stateParams, $http) {
        var domainId = $stateParams.domain;

        $http.get('https://ops-dev.blinker.com/v1/env/' + domainId + '/')
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
