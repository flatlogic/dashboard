(function () {
    'use strict';

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    servicesController.$inject = ['$scope', '$state', '$stateParams', '$http', 'API_URL', 'errorHandler', 'domainInstancesLoader'];
    function servicesController($scope, $state, $stateParams, $http, API_URL, errorHandler, domainInstancesLoader) {
        $scope.$watch('domains', function() {
            if (!$scope.domains) {
                return;
            }

            $scope.domain = $scope.domains.filter(function (domain) {
                return domain.id == $stateParams.domain;
            })[0];
        });

        domainInstancesLoader.load($stateParams.domain).then(
            function (response) {
                $scope.services = response.data.services;

                if(Object.size($scope.services) == 1 && $state.current.name == 'app.configurations.services'){
                    $state.go('.state', {service: $scope.services[0]})
                }

            },
            function (response) {
                $scope.error = errorHandler.showError(response.data, response.status);
            }
        );
    }

    angular.module('qorDash.configurations.services')
        .controller('ServicesController', servicesController);
})();
