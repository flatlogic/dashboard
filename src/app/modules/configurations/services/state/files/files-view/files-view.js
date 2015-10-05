(function () {
    'use strict';

    filesViewController.$inject = ['$scope', '$state', '$stateParams', '$http', '$modal', '$q', 'API_URL', 'errorHandler', 'Notification'];
    function filesViewController($scope, $state, $stateParams, $http, $modal, $q, API_URL, errorHandler, Notification) {

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
                    function(response) {
                        $scope.error = errorHandler.showError(response);
                    });
            }
        };

        $scope.showBaseFile = function() {
            if ($scope.selectedInstance) {
                var domainClass = $stateParams.domain,
                    service = $scope.service,
                    object = $stateParams.file;

                $http({
                    method: 'GET',
                    url: API_URL + '/v1/conf/' + domainClass +
                        '/' + service + '/' + object,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {
                        $scope.fileContents = response.data;
                        $scope.fileVersion = response.headers('X-Dash-Version');
                    },
                    function(e, code) {
                        $scope.error = errorHandler.showError(e, code);
                    });
            }
        };

        $scope.createVersion = function(newVersionName) {
            var request = {
                method: 'POST',
                url: API_URL + '/v1/conf/' + $stateParams.domain + '/'
                    + $scope.selectedInstance + '/' + $scope.service + '/' + newVersionName + '/' + $stateParams.file,
                headers: {
                    'X-Dash-Version': $scope.fileVersion
                }
            };

            if ($scope.contentsChanged) {
                request.data = $scope.fileContents;
            }

            return $http(request)
                .success(function(response) {
                    $scope.instance.versions.push(newVersionName);
                    $scope.selectVersion(newVersionName);
                    $scope.contentsChanged = false;
                    Notification.success('Successfully created');
                })
                .error(function(e, code) {
                    errorHandler.showError(e, code);
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
            }).success(function(response, code, headers, config) {
                $scope.fileVersion = headers('X-Dash-Version');
                $scope.contentsChanged = false;
                Notification.success('Saved successfully');
            })
            .error(function(e) {
                var error = e ? e.error : 'unknown server error';
                Notification.error('Can\'t load data: ' + error);
                $scope.loading = false;
            });
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
            var domainClass = $stateParams.domain,
                service = $scope.service,
                object = $stateParams.file,
                deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: API_URL + '/v1/conf/' + domainClass + '/'
                + $scope.selectedInstance + '/' + service + '/'
                + $scope.selectedVersion + '/' + object,
                headers: {
                    'X-Dash-Version': $scope.fileVersion
                }
            }).then(function() {
                deferred.resolve();
                Notification.success('Deleted successfully');
                $scope.loadInstance().then(function() {
                    $state.go('.');
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
            var postRequest = {
                method: 'POST',
                url: API_URL + '/v1/conf/' + $stateParams.domain + '/' + instance + '/' + $scope.service + '/' + version + '/' + $scope.fileName +  '/live',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            $http(postRequest)
                .success(function(response, code) {
                    Notification.success('Live version for ' + instance + ' has been changed.');
                    $scope.liveVersion[$scope.selectedInstance] = version;
                })
                .error(function(e) {
                    var error = e ? e.error : 'unknown server error';
                    Notification.error('Can\'t load data: ' + error);
                });
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
