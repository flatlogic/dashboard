(function () {
    'use strict';

    var configurationsController = angular.createAuthorizedController('ConfigurationsController', ['$scope','$state', '$http', '$stateParams', 'API_URL', '$timeout', function ($scope, $state, $http, $stateParams, API_URL, $timeout) {
        $scope.domainsPromise = $http.get(API_URL + '/v1/domain/')
            .success(function (response, status, headers) {
                $scope.domains = response;

                if($scope.domains.length === 1 && $state.current.name == 'app.configurations'){
                    $state.go('app.configurations.state', {domain:$scope.domains[0].id})
                }

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
