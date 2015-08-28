(function () {
    'use strict';

    filesViewController.$inject = ['$scope', '$state', '$stateParams', '$http', '$modal', '$q', 'API_URL', 'Notification'];
    function filesViewController($scope, $state, $stateParams, $http, $modal, $q, API_URL, Notification) {
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
                }).then(function(response) {
                        $scope.fileContents = response.data;
                        $scope.fileVersion = response.headers('X-Dash-Version');
                    },
                    function(e) {
                        var error = e ? e.error : 'unknown server error';
                        Notification.error('Can\'t load data: ' + error);
                        $scope.loading = false;
                    });
            }
        };

        $scope.saveFile = function () {
            if (!$scope.fileContents) {
                return
            }

            var domainClass = $stateParams.domain,
                service = $scope.service,
                object = $stateParams.file;
            $http({
                method: 'PUT',
                url: API_URL + '/v1/conf/' + domainClass + '/'
                + $scope.selectedInstance + '/' + service + '/'
                + $scope.selectedVersion + '/' + object,
                headers: {
                    'X-Dash-Version': $scope.fileVersion
                },
                data: $scope.fileContents
            }).then(function() {
                    Notification.success('Saved successfully');
                }, function(e) {
                    var error = e ? e.error : 'unknown server error';
                    Notification.error('Can\'t load data: ' + error);
                    $scope.loading = false;
                });
        };

        $scope.cloneFile = function () {
            $modal.open({
                animation: true,
                templateUrl: 'app/modules/configurations/files-view/files-clone-modal.html',
                controller: 'FilesCloneController',
                resolve: {
                    instance: function () {
                        return $scope.selectedInstance;
                    },
                    version: function () {
                        return $scope.selectedVersion;
                    },
                    instances: function() {
                        return $scope.instance.instances;
                    },
                    clone: function () {
                        return $scope._cloneFile;
                    }
                }
            });
        };

        $scope._cloneFile = function (version, instance) {
            var domainClass = $stateParams.domain,
                service = $scope.service,
                object = $stateParams.file,
                deferred = $q.defer();
            $http({
                method: 'POST',
                url: API_URL + '/v1/conf/' + domainClass + '/'
                    + instance + '/' + service + '/'
                    + version + '/' + object,
                headers: {
                    'Content-Type': 'text/plain'
                },
                data: $scope.fileContents
            }).then(function() {
                deferred.resolve();
                Notification.success('Cloned successfully');
                $scope.loadInstance().then(function() {
                    $state.go('.', {
                        instance: instance,
                        version: version
                    });
                });
            }, function(e) {
                deferred.reject();
                var error = e ? e.error : 'unknown server error';
                Notification.error('Can\'t load data: ' + error);
                $scope.loading = false;
            });

            return deferred.promise;
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

    filesCloneController.$inject = ['$scope', '$modalInstance', 'instance', 'version', 'instances', 'clone'];
    function filesCloneController($scope, $modalInstance, instance, version, instances, clone) {
        $scope.newVersionName = '';

        $scope.version = version;
        $scope.instance = instance;
        $scope.instances = instances;

        $scope.targetInstance = '';

        $scope.ok = function () {
            if (!$scope.newVersionName || !$scope.targetInstance) {
                return;
            }
            clone($scope.newVersionName, $scope.targetInstance).finally(function () {
                $modalInstance.close();
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }


    angular.module('qorDash.configurations.services.state.files.files-view')
        .controller('FilesViewController', filesViewController)
        .controller('FilesCloneController', filesCloneController)
    ;
})();
