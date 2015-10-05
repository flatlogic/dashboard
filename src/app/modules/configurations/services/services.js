(function () {
    'use strict';

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    servicesController.$inject = ['$scope', '$state', '$stateParams', 'errorHandler', 'domainLoader'];
    function servicesController($scope, $state, $stateParams, errorHandler, domainLoader) {
        $scope.$watch('domains', function() {
            if (!$scope.domains) {
                return;
            }

            $scope.domain = $scope.domains.filter(function (domain) {
                return domain.id == $stateParams.domain;
            })[0];
        });

        domainLoader.load($stateParams.domain).then(
            function (response) {
                $scope.services = response.data.services;

                if(Object.size($scope.services) == 1 && $state.current.name == 'app.configurations.services'){
                    $state.go('.state', {service: $scope.services[0]})
                }

            },
            function (response) {
                $scope.error = errorHandler.showError(response);
            }
        );
    }

    angular.module('qorDash.configurations.services')
        .controller('ServicesController', servicesController);
})();
