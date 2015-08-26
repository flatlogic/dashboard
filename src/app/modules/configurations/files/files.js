(function () {
    'use strict';

    filesController.$inject = ['$scope', '$stateParams', '$http', 'API_URL'];
    function filesController($scope, $stateParams, $http, API_URL) {

        $scope.$watch('domains', function() {
            if (!$scope.domains) {
                return;
            }
            $scope.domain = $scope.domains.filter(function (domain) {
                return domain.id == $stateParams.domain;
            })[0];
        });

        var instanceRequest = {
            method: 'GET',
            url: API_URL + '/v1/conf/' + $stateParams.domain + '/',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http(instanceRequest)
            .success(function(response) {
                for (var i in response) {
                    if (response[i].domain == $stateParams.domain) {
                        $scope.instance = response[i];
                        $scope.service = i;
                    }
                }
            })
            .error(function(e) {});
    }


    angular.module('qorDash.configurations.services.state.files')
        .controller('FilesController', filesController);
})();
