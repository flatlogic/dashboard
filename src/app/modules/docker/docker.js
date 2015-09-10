(function () {
    'use strict';

    var dockerController = angular.createAuthorizedController('DockerController', ['$scope', '$state', '$stateParams', '$http', 'API_URL', 'Notification',
                                                                            function ($scope, $state, $stateParams, $http, API_URL, Notification) {

        $http.get(API_URL + '/v1/domain/')
            .success(function (response, status, headers) {
                $scope.domains = response;

                if($scope.domains.length === 1 && $state.current.name == 'app.docker'){
                    $state.go('app.docker.domain', {id:$scope.domains[0].id})
                }
            })
            .error(function (response, code) {
                var error = response ? response.error : 'unknown server error';
                Notification.error('Can\'t load data: ' + error);
                $scope.error = error;
            });
    }]);

    angular.module('qorDash.domains')
        .controller(dockerController);
})();
