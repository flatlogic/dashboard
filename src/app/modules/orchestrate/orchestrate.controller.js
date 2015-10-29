(function () {
    'use strict';

    var orchestrateController = angular.createAuthorizedController('OrchestrateController', ['$scope', '$state', '$stateParams', 'errorHandler', 'domainsLoader', 'resolvedDomains',
    function ($scope, $state, $stateParams, errorHandler, domainsLoader, resolvedDomains) {
        $scope.domains = resolvedDomains;

        if($scope.domains.length === 1 && $state.current.name == 'app.orchestrate'){
            $state.go('app.orchestrate.domain', {id:$scope.domains[0].id})
        }

        $scope.domain = $scope.domains.filter(function (domain) {
            return domain.id == $stateParams.id;
        })[0];
    }]);

    angular
        .module('qorDash.orchestrate')
        .controller(orchestrateController);

})();
