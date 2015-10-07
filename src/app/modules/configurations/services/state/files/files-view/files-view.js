(function () {
    'use strict';

    filesViewController.$inject = ['$scope', '$state', '$stateParams', 'configurationService', '$modal', '$q', 'errorHandler', 'Notification'];
    function filesViewController($scope, $state, $stateParams, configurationService, $modal, $q, errorHandler, Notification) {

        $scope.addNewVersionClicked = false;

        $scope.selectInstance = function (instance) {
            if ($scope.selectedInstance != instance) {
                $scope.selectedVersion = '';
            }
            $scope.selectedInstance = instance;

            $state.go('.', {
                instance: $scope.selectedInstance,
                version: $scope.selectedVersion
            });

            $scope.showFile();
        };

        $scope.$watch('instance', function() {
            if ($scope.instance) {
                $scope._loadVersions();
            }
        });

        $scope.versions = {};
        $scope.liveVersion = {};
        $scope.instances = [];

        $scope._loadVersions = function() {
            $scope.instance.instances.forEach(function(instance) {
                configurationService.files.getVersions($stateParams.domain, instance, $scope.service, $stateParams.file).then(
                    function(response) {
                        response = response.data;
                        if (!$scope.versions[instance]) {
                            $scope.versions[instance] = [];
                        }

                        if (response.length != 0) {
                            $scope.instances.push(instance);
                        }

                        for (var i in response) {
                            $scope.versions[instance].push(i);
                            if (response[i]) {
                                $scope.liveVersion[instance] = i;
                            }
                        }
                    },
                    function (response) {
                        $scope.error = errorHandler.showError(response);
                    }
                );
            });
        };

        $scope.selectVersion = function(version) {
            $scope.selectedVersion = version;

            if ($scope.addNewVersionClicked) {
                $scope.addNewVersionClicked = false;
            }

            $state.go('.', {
                instance: $scope.selectedInstance,
                version: $scope.selectedVersion
            });


            $scope.showFile();
        };

        $scope.clickAddNewVersion = function() {
            $scope.addNewVersionClicked = true;

            $scope.showBaseFile();
        };

        $scope.showFile = function () {
            if ($scope.selectedInstance && $scope.selectedVersion) {
                configurationService.files.getFileContent($stateParams.domain, $scope.selectedInstance, $scope.service, $scope.selectedVersion, $stateParams.file).then(
                    function(response) {
                        $scope.fileContents = response.data;
                        $scope.fileVersion = response.headers('X-Dash-Version');
                    },
                    function(response) {
                        $scope.error = errorHandler.showError(response);
                    }
                );
            }
        };

        $scope.showBaseFile = function() {
            if ($scope.selectedInstance) {
                configurationService.files.getBaseFile($stateParams.domain, $scope.service, $stateParams.file).then(
                    function(response) {
                        $scope.fileContents = response.data;
                        $scope.fileVersion = response.headers('X-Dash-Version');
                    },
                    function(response) {
                        $scope.error = errorHandler.showError(response);
                    }
                );
            }
        };

        $scope.createVersion = function(newVersionName) {
            if ($scope.contentsChanged) {
                request.data = $scope.fileContents;
            }

            return configurationService.files.createVersion($stateParams.domain, $scope.selectedInstance, $scope.service, newVersionName, $stateParams.file, $scope.fileVersion)
                .success(function(response) {
                    $scope.instance.versions.push(newVersionName);
                    $scope.selectVersion(newVersionName);
                    $scope.contentsChanged = false;
                    Notification.success('Successfully created');
                })
                .error(function(response) {
                    errorHandler.showError(response);
                });
        };

        $scope.saveFile = function () {
            if (!$scope.fileContents) {
                return
            }

            if ($scope.addNewVersionClicked) {
                $modal.open({
                    animation: true,
                    templateUrl: 'app/modules/configurations/services/state/files/new-version-modal.html',
                    controller: 'NewVersionController',
                    size: 'sm',
                    resolve: {
                        createVersion: function () {
                            return $scope.createVersion;
                        }
                    }
                });
                return;
            }

            configurationService.files.saveFile($stateParams.domain, $scope.selectedInstance, $scope.service, $scope.selectedVersion, $stateParams.file, $scope.fileVersion, $scope.fileContents).then(
                function(response) {
                    $scope.fileVersion = response.headers('X-Dash-Version');
                    $scope.contentsChanged = false;
                    Notification.success('Saved successfully');
                },
                function(response) {
                    $scope.loading = false;
                }
            );
        };

        $scope.cloneFile = function () {
            $modal.open({
                animation: true,
                templateUrl: 'app/modules/configurations/services/state/files/files-view/files-clone-modal.html',
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
            var deferred = $q.defer();
            configurationService.files.cloneFile($stateParams.domain, $scope.selectedInstance, $scope.service, $scope.selectedVersion,$stateParams.file, $scope.fileContents).then(function() {
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

        $scope.deleteFile = function () {
            $modal.open({
                animation: true,
                templateUrl: 'app/modules/configurations/services/state/files/files-view/files-delete-modal.html',
                controller: 'FilesDeleteController',
                resolve: {
                    instance: function () {
                        return $scope.selectedInstance;
                    },
                    version: function () {
                        return $scope.selectedVersion;
                    },
                    fileName: function () {
                        return $scope.fileName;
                    },
                    _delete: function () {
                        return $scope._deleteFile;
                    }
                }
            });
        };

        $scope._deleteFile = function () {
            var deferred = $q.defer();
            configurationService.files.deleteFile($stateParams.domain, $scope.selectedInstance, $scope.service, $scope.selectedVersion,$stateParams.file, $scope.fileVersion).then(function() {
                deferred.resolve();
                Notification.success('Deleted successfully');
                $scope.loadInstance().then(function() {
                    $state.go('.');
                });
            }, function(e) {
                deferred.reject();
                var error = e.data ? e.data.error : 'unknown server error';
                Notification.error('Can\'t load data: ' + error);
                $scope.loading = false;
            });

            return deferred.promise;
        };


        $scope.isInstanceActive = function(instance) {
            return instance == $scope.selectedInstance;
        };

        $scope.isVersionActive = function(version) {
            if ($scope.addNewVersionClicked) {
                return false;
            }
            return version == $scope.selectedVersion;
        };

        $scope.isVersionLive = function(version) {
            if (!version) {
                return false;
            }
            return version == $scope.liveVersion[$scope.selectedInstance];
        };

        $scope.isLive = function(instance, version) {
            if (!$scope.instance || !version || !instance) {
                return false;
            } else {
                if (!$scope.instance.live[instance] || !$scope.instance.live[instance][$scope.fileName]) {
                    return false;
                }
                return version != $scope.instance.live[instance][$scope.fileName];
            }
        };

        $scope.makeLive = function(instance, version) {
            configurationService.files.makeVersionLive($stateParams.domain, instance, $scope.service, version, $stateParams.file).then(
                function(response) {
                    Notification.success('Live version for ' + instance + ' has been changed.');
                    $scope.liveVersion[$scope.selectedInstance] = version;
                },
                function(e) {
                    var error = e ? e.error : 'unknown server error';
                    Notification.error('Can\'t load data: ' + error);
                }
            );
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

    filesDeleteController.$inject = ['$scope', '$modalInstance', 'instance', 'version', 'fileName', '_delete'];
    function filesDeleteController($scope, $modalInstance, instance, version, fileName, _delete) {

        $scope.version = version;
        $scope.instance = instance;
        $scope.fileName = fileName;

        $scope.ok = function () {
            _delete().finally(function () {
                $modalInstance.close();
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }

    newVersionController.$inject = ['$scope', 'createVersion', '$modalInstance'];
    function newVersionController($scope, createVersion, $modalInstance) {
        $scope.ok = function ($event) {
            if (!$scope.versionName) {
                return;
            }

            $scope.event = $event;

            $($event.target).button('loading');

            createVersion($scope.versionName)
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


    angular.module('qorDash.configurations.services.state.files.files-view')
        .controller('FilesViewController', filesViewController)
        .controller('FilesCloneController', filesCloneController)
        .controller('FilesDeleteController', filesDeleteController)
        .controller('NewVersionController', newVersionController)
    ;
})();
