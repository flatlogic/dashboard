(function () {
    'use strict';

    var dockerController = angular.createAuthorizedController('DockerController', ['$scope', '$state', '$stateParams', 'errorHandler', 'domainsLoader',
        function ($scope, $state, $stateParams, errorHandler, domainsLoader) {
            domainsLoader.load().then(
                function (response) {
                    $scope.domains = response.data;

                if($scope.domains.length === 1 && $state.current.name == 'app.docker'){
                    $state.go('app.docker.domain', {domain:$scope.domains[0].id})
                }
            },
                function (response) {
                    $scope.error = errorHandler.showError(response);
            });
    }]);

    angular.module('qorDash.domains')
        .controller(dockerController);
})();
