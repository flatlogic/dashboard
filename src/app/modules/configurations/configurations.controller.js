(function () {
    'use strict';

    angular
        .module('qorDash.configurations')
        .controller('ConfigurationsController', configurationsController);

    function configurationsController($scope, $state, $stateParams, resolvedDomains) {
        $scope.domains = resolvedDomains;

        if($scope.domains.length === 1 && $state.current.name == 'app.configurations'){
            $state.go('.services', {domain:$scope.domains[0].id});
        }

        $scope.domain = $scope.domains.filter(function (domain) {
            return domain.id == $stateParams.domain;
        })[0];
    }
})();
