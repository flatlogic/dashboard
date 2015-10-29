(function () {
    'use strict';

    var configurationsController = angular.createAuthorizedController('ConfigurationsController', ['$scope', '$state', '$stateParams', 'resolvedDomains',
        function ($scope, $state, $stateParams, resolvedDomains) {
            $scope.domains = resolvedDomains;

            if($scope.domains.length === 1 && $state.current.name == 'app.configurations'){
                $state.go('.services', {domain:$scope.domains[0].id});
            }

            $scope.domain = $scope.domains.filter(function (domain) {
                return domain.id == $stateParams.domain;
            })[0];
    }]);

    angular
        .module('qorDash.configurations')
        .controller(configurationsController);
})();
