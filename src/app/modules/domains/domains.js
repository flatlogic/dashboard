(function () {
    'use strict';

    var domainsController = angular.createAuthorizedController('DomainsController', ['$scope', '$state', '$stateParams', 'errorHandler', 'domainsLoader',
        function ($scope, $state, $stateParams, errorHandler, domainsLoader) {
            domainsLoader.load().then(
                function (response) {
                    $scope.domains = response.data;

                if($scope.domains.length === 1 && $state.current.name == 'app.domains'){
                    $state.go('app.domains.domain', {id:$scope.domains[0].id})
                }
            },
                function (response) {
                    $scope.error = errorHandler.showError(response);
                }
            );
    }]);

    angular.module('qorDash.domains')
        .controller(domainsController);
})();
