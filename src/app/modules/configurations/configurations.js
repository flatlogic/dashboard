(function () {
    'use strict';

    var configurationsController = angular.createAuthorizedController('ConfigurationsController', ['$scope','$state', '$stateParams', '$timeout', 'errorHandler', 'domainsLoader',
                                                                                function ($scope, $state, $stateParams, $timeout, errorHandler, domainsLoader) {
        $scope.domainsPromise = domainsLoader.load().then(
            function (response) {
                $scope.domains = response.data;

                if($scope.domains.length === 1 && $state.current.name == 'app.configurations'){
                    $state.go('app.configurations.services', {domain: $scope.domains[0].id})
                }

                $scope.domain = $scope.domains.filter(function (domain) {
                    return domain.id == $stateParams.id;
                })[0];
            },
            function (response) {
                $scope.error = errorHandler.showError(response);
            }
        );
    }]);

    angular.module('qorDash.configurations')
        .controller(configurationsController);

})();
