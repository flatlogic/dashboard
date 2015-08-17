(function () {
    'use strict';

    angular.module('qorDash.configurations');

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

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

                if(Object.size($scope.services) == 1 && $state.current.name == 'app.configurations.services'){
                    $state.go('app.configurations.services.instances', {service: $scope.services[Object.keys($scope.services)[0]].service})
                }

            })
            .error(function (response, status) {
                // TODO Add error message
            });
    }

    angular.module('qorDash.configurations')
        .controller('ServicesController', servicesController);
})();
