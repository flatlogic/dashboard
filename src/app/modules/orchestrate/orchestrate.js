(function () {
    'use strict';

    var orchestrateController = angular.createAuthorizedController('OrchestrateController', ['$scope', '$state', '$stateParams', 'errorHandler', 'domainsLoader',
    function ($scope, $state, $stateParams, errorHandler, domainsLoader) {
        domainsLoader.load().then(
            function (response) {
                $scope.domains = response.data;

                if($scope.domains.length === 1 && $state.current.name == 'app.orchestrate'){
                    $state.go('app.orchestrate.domain', {id:$scope.domains[0].id})
                }

                $scope.domain = $scope.domains.filter(function (domain) {
                    return domain.id == $stateParams.id;
                })[0];
            },
            function (response) {
                $scope.error = errorHandler.showError(response.data, response.status);
            }
        );
    }]);

    angular.module('qorDash.orchestrate')
        .controller(orchestrateController);

})();
