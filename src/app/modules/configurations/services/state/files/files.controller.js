(function () {
    'use strict';

    function filesController($scope, configurationService, resolvedInstance, $stateParams, errorHandler, $modal, Notification) {

        $scope.instance = resolvedInstance[$stateParams.service];
        $scope.service = $stateParams.service;
        $scope.domain = $stateParams.domain;

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
            return configurationService.files.createFile($scope.domain, $stateParams.service, fileName, text)
                .success(function(response) {
                    $scope.instance.objects.push(fileName);
                    Notification.success('Successfully created');
                })
                .error(function(e, code) {
                    errorHandler.showError(e, code);
                });
        };
    }

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
