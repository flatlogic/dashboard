(function () {
    'use strict';

    var dockerController = angular.createAuthorizedController('DockerController', ['$scope', '$state', '$stateParams', '$http', 'API_URL', function ($scope, $state, $stateParams, $http, API_URL) {

        $http.get(API_URL + '/v1/domain/')
            .success(function (response, status, headers) {
                $scope.domains = response;

                if($scope.domains.length === 1 && $state.current.name == 'app.docker'){
                    $state.go('app.docker.domain', {id:$scope.domains[0].id})
                }
            })
            .error(function (response, code) {
                // TODO Add error message
            });
    }]);

    angular.module('qorDash.domains')
        .controller(dockerController);
})();
