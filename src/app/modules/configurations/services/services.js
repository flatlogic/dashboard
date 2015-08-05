(function () {
    'use strict';

    angular.module('qorDash.configurations');

    servicesController.$inject = ['$scope', '$state', '$stateParams', '$http', 'API_URL'];
    function servicesController($scope, $state, $stateParams, $http, API_URL) {
        var domainId = $stateParams.domain;

        $scope.$watch('domains', function() {
            if (!$scope.domains) {
                return;
            }

            $scope.domain = $scope.domains.filter(function (domain) {
                return domain.id == $stateParams.domain;
            })[0];
        });

        $http.get(API_URL + '/v1/env/' + domainId + '/')
            .success(function (response, status, headers) {
                $scope.services = response;

                if($scope.services.length === 1 && $state.current.name == 'app.configurations.services'){
                    $state.go('app.configurations.services.editor', {service: $scope.services[0].service})
                }

            })
            .error(function (response, status) {
                // TODO Add error message
            });
    }

    angular.module('qorDash.configurations')
        .controller('ServicesController', servicesController);
})();
