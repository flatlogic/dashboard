(function () {
    'use strict';

    var dockerController = angular.createAuthorizedController('DockerController', ['$scope', '$state', '$stateParams', '$http', 'API_URL', 'errorHandler',
                                                                            function ($scope, $state, $stateParams, $http, API_URL, errorHandler) {

        $http.get(API_URL + '/v1/domain/')
            .success(function (response, status, headers) {
                $scope.domains = response;

                if($scope.domains.length === 1 && $state.current.name == 'app.docker'){
                    $state.go('app.docker.domain', {domain:$scope.domains[0].id})
                }
            })
            .error(function (e, code) {
                $scope.error = errorHandler.showError(e, code);
            });
    }]);

    angular.module('qorDash.domains')
        .controller(dockerController);
})();
