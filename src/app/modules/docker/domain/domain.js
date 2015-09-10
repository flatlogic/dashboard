(function () {
    'use strict';

    angular.module('qorDash.docker')
        .controller('DockerDomainController', domainController);

    domainController.$inject = ['$scope', '$stateParams', '$http', 'API_URL', 'Notification'];
    function domainController($scope, $stateParams, $http, API_URL, Notification) {
        var domainId = $stateParams.id;

        $http.get(API_URL + '/v1/domain/' + domainId)
            .success(function (response, status, headers) {
                $scope.domain = response;
            })
            .error(function (response, status) {
                var error = response ? response.error : 'unknown server error';
                Notification.error('Can\'t load data: ' + error);
                $scope.error = error;
            });
    }

})();
