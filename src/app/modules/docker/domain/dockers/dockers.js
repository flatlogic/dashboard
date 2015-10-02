(function () {
    'use strict';

    var module = angular.module('qorDash.docker')
        .controller('DockersController', dockersController);

    dockersController.$inject = ['$scope', '$stateParams', '$http', 'API_URL', 'errorHandler'];
    function dockersController($scope, $stateParams, $http, API_URL, errorHandler) {
        var domainId = $stateParams.domain,
            instance = $stateParams.instance;

        $scope.instance = instance;

        var url = API_URL + '/v1/dockerapi/' + domainId + '/' + instance + '/';
        console.log(url);

        $http.get(url).then(
            function (response) {
                $scope.dockers = response.data;
            },
            function (response) {
                $scope.error = errorHandler.showError(response.data, response.status);
            }
        );
    }

})();
