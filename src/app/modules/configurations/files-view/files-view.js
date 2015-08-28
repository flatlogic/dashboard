(function () {
    'use strict';

    filesViewController.$inject = ['$scope', '$state', '$stateParams', '$http', 'API_URL', 'Notification'];
    function filesViewController($scope, $state, $stateParams, $http, API_URL, Notification) {
        $scope.selectInstance = function (instance) {
            $scope.selectedInstance = instance;

            $state.go('.', {
                instance: $scope.selectedInstance,
                version: $scope.selectedVersion
            });

            $scope.showFile();
        };

        $scope.selectVersion = function(version) {
            $scope.selectedVersion = version;

            $state.go('.', {
                instance: $scope.selectedInstance,
                version: $scope.selectedVersion
            });

            $scope.showFile();
        };

        $scope.showFile = function () {
            if ($scope.selectedInstance && $scope.selectedVersion) {
                var domainClass = $stateParams.domain,
                    service = $scope.service,
                    object = $stateParams.file;

                $http({
                    method: 'GET',
                    url: API_URL + '/v1/conf/' + domainClass + '/'
                    + $scope.selectedInstance + '/' + service + '/'
                    + $scope.selectedVersion + '/' + object,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success (function(response) {
                    $scope.fileContents = response;
                }).error (function(e) {
                    var error = e ? e.error : 'unknown server error';
                    Notification.error('Can\'t load data: ' + error);
                    $scope.loading = false;
                });
            }
        };

        $scope.isInstanceActive = function(instance) {
            return instance == $scope.selectedInstance;
        };

        $scope.isVersionActive = function(version) {
            return version == $scope.selectedVersion;
        };

        $scope.isVersionLive = function(version) {
            if (!$scope.selectedInstance || !$scope.instance) {
                return false;
            }
            return version == $scope.instance.live[$scope.selectedInstance][$scope.fileName];
        };

        $scope.fileName = $stateParams.file;

        $scope.selectedInstance = $stateParams.instance;
        $scope.selectedVersion = $stateParams.version;
        $scope.fileContents = '';

        $scope.$watch('service', function (service) {
            if (!service) return;

            $scope.showFile();
        })
    }


    angular.module('qorDash.configurations.services.state.files.files-view')
        .controller('FilesViewController', filesViewController);
})();
