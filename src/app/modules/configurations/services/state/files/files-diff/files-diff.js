(function () {
    'use strict';

    filesEditorController.$inject = ['$scope', '$state', '$stateParams', '$http', 'API_URL', 'errorHandler'];
    function filesEditorController($scope, $state, $stateParams, $http, API_URL, errorHandler) {

        $scope.$watch('domains', function() {
            if (!$scope.domains) {
                return;
            }
            $scope.domain = $scope.domains.filter(function (domain) {
                return domain.id == $stateParams.domain;
            })[0];
        });

        $scope.$watch('service', function() {
            if (!$scope.service) {
                return;
            }

            $scope.showDiff();
        });

        $scope.options = {
            attrs: {
                'insert': {
                    'data-attr': 'insert',
                    'class': 'insertion'
                },
                'delete': {
                    'data-attr': 'delete'
                },
                'equal': {
                    'data-attr': 'equal'
                }
            }
        };

        $scope.fileName = $stateParams.file;

        $scope.selectedFirstInstance = $stateParams.instance;
        $scope.selectedSecondInstance = $stateParams.diffToInstance;
        $scope.selectedFirstVersion = $stateParams.version;
        $scope.selectedSecondVersion = $stateParams.diffToVersion;

        $scope.syncState = function () {
            $state.go('.', {
                instance: $scope.selectedFirstInstance,
                version: $scope.selectedFirstVersion,
                diffToInstance: $scope.selectedSecondInstance,
                diffToVersion: $scope.selectedSecondVersion,
                _preventAnimation: true
            });
        };

        $scope.selectFirstInstance = function(instance) {
            $scope.selectedFirstInstance = instance;

            $scope.syncState();
            $scope.showDiff();
        };

        $scope.selectSecondInstance = function(instance) {
            $scope.selectedSecondInstance = instance;

            $scope.syncState();
            $scope.showDiff();
        };

        $scope.selectFirstVersion = function(version) {
            $scope.selectedFirstVersion = version;

            $scope.syncState();
            $scope.showDiff();
        };

        $scope.selectSecondVersion = function(version) {
            $scope.selectedSecondVersion = version;

            $scope.syncState();
            $scope.showDiff();
        };

        $scope.isFirstInstanceActive = function(instance) {
            return instance == $scope.selectedFirstInstance;
        };

        $scope.isSecondInstanceActive = function(instance) {
            return instance == $scope.selectedSecondInstance;
        };

        $scope.isFirstVersionActive = function(version) {
            return version == $scope.selectedFirstVersion;
        };

        $scope.isSecondVersionActive = function(version) {
            return version == $scope.selectedSecondVersion;
        };

        $scope.isFirstVersionLive = function(version) {
            if (!$scope.selectedFirstInstance || !$scope.instance) {
                return false;
            }
            return version == $scope.instance.live[$scope.selectedFirstInstance][$scope.fileName];
        };

        $scope.isSecondVersionLive = function(version) {
            if (!$scope.selectedSecondInstance || !$scope.instance) {
                return false;
            }
            return version == $scope.instance.live[$scope.selectedSecondInstance][$scope.fileName];
        };

        $scope.showDiff = function() {
            if (!$scope.selectedFirstInstance ||
                !$scope.selectedSecondInstance ||
                !$scope.selectedFirstVersion ||
                !$scope.selectedSecondVersion) {
                return;
            }

            $scope.loading = true;

            var domainClass = $stateParams.domain,
                service = $scope.service,
                object = $stateParams.file;


            var getFirstFileRequest = {
                method: 'GET',
                url: API_URL + '/v1/conf/' + domainClass + '/' + $scope.selectedFirstInstance + '/' + service + '/' + $scope.selectedFirstVersion + '/' + object,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            var getSecondFileRequest = {
                method: 'GET',
                url: API_URL + '/v1/conf/' + domainClass + '/' + $scope.selectedSecondInstance + '/' + service + '/' + $scope.selectedSecondVersion + '/' + object,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            $http(getFirstFileRequest)
                .success (function(response) {
                    $scope.firstFileData = response;

                    $http(getSecondFileRequest)
                        .then(function(response) {
                            $scope.secondFileData = response.data;

                        }, function(e) {
                            $scope.error = errorHandler.showError(response, code);
                        });
                })
                .error (function(e, code) {
                    $scope.error = errorHandler.showError(e, code);
                });
        }
    }


    angular.module('qorDash.configurations.services.state.files.files-view.diff')
        .controller('FilesEditorController', filesEditorController);
})();