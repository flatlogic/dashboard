(function () {
    'use strict';
    angular
        .module('qorDash.orchestrate')
        .controller('OrchestrateController', orchestrateController);

    function orchestrateController($scope, $state, $stateParams, resolvedDomains) {
        $scope.domains = resolvedDomains;

        if($scope.domains.length === 1 && $state.current.name == 'app.orchestrate'){
            $state.go('app.orchestrate.domain', {id:$scope.domains[0].id})
        }

        $scope.domain = $scope.domains.filter(function (domain) {
            return domain.id == $stateParams.id;
        })[0];
    }
})();
