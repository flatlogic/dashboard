(function () {
    'use strict';

    var domainsController = angular.createAuthorizedController('DomainsController', ['$scope', '$stateParams', '$http', function ($scope, $stateParams, $http) {

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

    angular.module('qorDash.domains')
        .controller(domainsController);
})();
