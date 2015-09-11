(function () {
    'use strict';

    var configurationsController = angular.createAuthorizedController('ConfigurationsController', ['$scope','$state', '$http', '$stateParams', 'API_URL', '$timeout', 'errorHandler',
                                                                                function ($scope, $state, $http, $stateParams, API_URL, $timeout, errorHandler) {
        $scope.domainsPromise = $http.get(API_URL + '/v1/domain/')
            .success(function (response) {
                $scope.domains = response;

                if($scope.domains.length === 1 && $state.current.name == 'app.configurations'){
                    $state.go('app.configurations.services', {domain: $scope.domains[0].id})
                }

                $scope.domain = $scope.domains.filter(function (domain) {
                    return domain.id == $stateParams.id;
                })[0];
            })
            .error(function (response, code) {
                $scope.error = errorHandler.showError(response, code);
            });
    }]);

    angular.module('qorDash.configurations')
        .controller(configurationsController);

})();
