(function () {
    'use strict';

    angular.module('qorDash.docker')
        .controller('DockersController', dockersController);

    dockersController.$inject = ['$scope', '$stateParams', '$http', 'API_URL', 'Notification'];
    function dockersController($scope, $stateParams, $http, API_URL, Notification) {
        var domainId = $stateParams.id,
            instance = $stateParams.instance;

        $scope.instance = instance;

        var url = API_URL + '/v1/dockerapi/' + domainId + '/' + instance + '/';
        console.log(url);

        $http.get(url)
            .success(function (response, status, headers) {
                $scope.dockers = response;
            })
            .error(function (response, status) {
                var error = response ? response.error : 'unknown server error';
                Notification.error('Can\'t load data: ' + error);
                $scope.error = error;
            });
    }

})();
