(function () {
    'use strict';

    filesController.$inject = ['$scope', '$stateParams', '$q', '$http', 'API_URL', 'errorHandler'];
    function filesController($scope, $stateParams, $q, $http, API_URL, errorHandler) {

        $scope.$watch('domains', function() {
            if (!$scope.domains) {
                return;
            }
            $scope.domain = $scope.domains.filter(function (domain) {
                return domain.id == $stateParams.domain;
            })[0];
        });

        $scope.loadInstance = function () {
            var instanceRequest = {
                method: 'GET',
                url: API_URL + '/v1/conf/' + $stateParams.domain + '/',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            var deferred = $q.defer();
            $http(instanceRequest)
                .success(function(response) {
                    $scope.instance = response[$stateParams.service];
                    $scope.service = $stateParams.service;
                    deferred.resolve();
                })
                .error(function(e, code) {
                    $scope.error = errorHandler.showError(e, code);
                });

            return deferred.promise;
        };

        $scope.loadInstance();
    }


    angular.module('qorDash.configurations.services.state.files')
        .controller('FilesController', filesController);
})();
