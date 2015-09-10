(function () {
    'use strict';

    var configurationsController = angular.createAuthorizedController('ConfigurationsController', ['$scope','$state', '$http', '$stateParams', 'API_URL', '$timeout', 'Notification',
                                                                                function ($scope, $state, $http, $stateParams, API_URL, $timeout, Notification) {
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
                var error = response ? response.error : 'unknown server error';
                Notification.error('Can\'t load data: ' + error);
                $scope.error = error;
            });
    }]);

    angular.module('qorDash.configurations')
        .controller(configurationsController);

})();
