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
                .then(function(response) {
                    $scope.instance.objects.push(fileName);
                    Notification.success('Successfully created');
                    return response;
                }, function(response) {
                    errorHandler.showError(response.data, response.status);
                    throw response;
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
                .then(function() {
                    $modalInstance.close();
                }, function() {
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
