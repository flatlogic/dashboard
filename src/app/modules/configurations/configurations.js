(function () {
    'use strict';

    var configurationsController = angular.createAuthorizedController('ConfigurationsController', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
        $http.get('https://ops-dev.blinker.com/v1/domain/')
            .success(function (response, status, headers) {
                $scope.domains = response;

                $scope.domain = $scope.domains.filter(function (domain) {
                    return domain.id == $stateParams.id;
                })[0];
            })
            .error(function (response, code) {
                // TODO Add error message
            });
    }]);

    angular.module('qorDash.configurations')
        .controller(configurationsController);

})();
