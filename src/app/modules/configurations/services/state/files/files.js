(function () {
    'use strict';

    filesController.$inject = ['$scope', '$stateParams', '$q', '$http', 'API_URL', 'errorHandler', '$modal', 'Notification'];
    function filesController($scope, $stateParams, $q, $http, API_URL, errorHandler, $modal, Notification) {

        $scope.$watch('domains', function() {
            if (!$scope.domains) {
                return;
            }
            $scope.domain = $scope.domains.filter(function (domain) {
                return domain.id == $stateParams.domain;
            })[0];
        });

        $scope.openNewFileModal = function() {
            $modal.open({
                animation: true,
                templateUrl: 'app/modules/configurations/services/state/files/new-file-modal.html',
                controller: 'NewFileController',
                size: 'lg',
                resolve: {
                    createFile: function () {
                        return $scope.createFile;
                    }
                }
            });
        };

        $scope.createFile = function(fileName, text) {
            var request = {
                method: 'POST',
                url: API_URL + '/v1/conf/' + $stateParams.domain + '/' + $stateParams.service + '/' + fileName,
                headers: {
                    'Content-Type': 'text/plain'
                },
                data: text
            };

            return $http(request)
                .success(function(response) {
                    $scope.instance.objects.push(fileName);
                    Notification.success('Successfully created');
                })
                .error(function(e, code) {
                    errorHandler.showError(e, code);
                });
        };

        $scope.loadInstance = function () {
            var instanceRequest = {
                method: 'GET',
                url: API_URL + '/v1/conf/' + $stateParams.domain + '/',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            $http(instanceRequest)
                .success(function(response) {
                    $scope.instance = response[$stateParams.service];
                    $scope.service = $stateParams.service;
                })
                .error(function(e, code) {
                    $scope.error = errorHandler.showError(e, code);
                });
        };

        $scope.loadInstance();
    }

    newFileController.$inject = ['$scope', 'createFile', '$modalInstance'];
    function newFileController($scope, createFile, $modalInstance) {
        $scope.ok = function ($event) {
            if (!$scope.fileName || !$scope.fileContent) {
                return;
            }

            $scope.event = $event;

            $($event.target).button('loading');

            createFile($scope.fileName, $scope.fileContent)
                .success(function() {
                    $modalInstance.close();
                })
                .error(function() {
                    $($scope.event.target).button('reset');
                });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }

    angular.module('qorDash.configurations.services.state.files')
        .controller('FilesController', filesController)
        .controller('NewFileController', newFileController);
})();
