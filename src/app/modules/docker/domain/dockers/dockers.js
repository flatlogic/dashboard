(function () {
    'use strict';

    angular.module('qorDash.docker')
        .controller('DockersController', dockersController);

    dockersController.$inject = ['$scope', '$stateParams', '$http', 'API_URL', 'errorHandler'];
    function dockersController($scope, $stateParams, $http, API_URL, errorHandler) {
        var domainId = $stateParams.id,
            instance = $stateParams.instance;

        $scope.instance = instance;

        var url = API_URL + '/v1/dockerapi/' + domainId + '/' + instance + '/';
        console.log(url);

        $http.get(url)
            .success(function (response, status, headers) {
                $scope.dockers = response;
            })
            .error(function (e, code) {
                $scope.error = errorHandler.showError(e, code);
            });
    }

})();
