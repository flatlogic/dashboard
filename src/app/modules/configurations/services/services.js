(function () {
    'use strict';

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    servicesController.$inject = ['$scope', '$state', '$stateParams', '$http', 'API_URL', 'errorHandler'];
    function servicesController($scope, $state, $stateParams, $http, API_URL, errorHandler) {
        var domainId = $stateParams.domain;

        $scope.$watch('domains', function() {
            if (!$scope.domains) {
                return;
            }

            $scope.domain = $scope.domains.filter(function (domain) {
                return domain.id == $stateParams.domain;
            })[0];
        });

        $http.get(API_URL + '/v1/domain/' + domainId)
            .success(function (response) {
                $scope.services = response.services;

                if(Object.size($scope.services) == 1 && $state.current.name == 'app.configurations.services'){
                    $state.go('.state', {service: $scope.services[0]})
                }

            })
            .error(function (e, code) {
                $scope.error = errorHandler.showError(e, code);
            });
    }

    angular.module('qorDash.configurations.services')
        .controller('ServicesController', servicesController);
})();
