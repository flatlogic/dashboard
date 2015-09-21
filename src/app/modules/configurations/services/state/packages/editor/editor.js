(function () {
    'use strict';

    angular.module('qorDash.configurations.services.state.packages.editor')
        .config(function(NotificationProvider) {
            NotificationProvider.setOptions({
                delay: 5000,
                positionX: 'right',
                positionY: 'bottom'
            });
        });

    packagesEditorController.$inject = ['$scope', '$stateParams', 'API_URL', '$http', '$modal', 'Notification'];
    function packagesEditorController($scope, $stateParams, API_URL, $http, $modal, Notification) {

        $scope.selectedVersion = {};

        $scope.itemsForSave = {};
        $scope.newItemsCount = 0;

        $scope.values = {};

        $scope.requestsCounter = 0;

        $scope.versions = {};
        $scope.liveVersion = {};

        $scope.$watch('domains', function() {
            if (!$scope.domains) {
                return;
            }
            $scope.domain = $scope.domains.filter(function (domain) {
                return domain.id == $stateParams.domain;
            })[0];
        });

        Object.filter = function( obj, predicate) {
            var key;

            for (key in obj) {
                if (obj.hasOwnProperty(key) && predicate(key)) {
                    return obj[key];
                }
            }
        };

        $scope.$watch('service', function() {
            if (!$scope.service) {
                return;
            }

            $scope.editorService = $scope.service;

            $scope.editorService.instances = $stateParams.instances.split(',');

            $scope.editorService.instances.forEach(function (instance) {
                $scope.selectedVersion[instance] = $scope.editorService.versions[0];
            });

            // Versions that doesn't exist
            $scope.deletedVersions = {};

            $scope.isVersionDeleted = function(instance, version) {
                if (!$scope.deletedVersions[instance]) {
                    return false;
                } else {
                    for (var i in $scope.deletedVersions[instance]) {
                        if ($scope.deletedVersions[instance][i] == version) {
                            return true;
                        }
                    }
                }
                return false;
            };

            $scope.changeSelected = function (instance, version) {
                if ($scope.isVersionDeleted(instance, $scope.selectedVersion[instance])) {
                    for (var i in $scope.editorService.versions) {
                        if (!$scope.isVersionDeleted(instance, $scope.editorService.versions[i])) {
                            $scope.selectedVersion[instance] = $scope.editorService.versions[i];
                        }
                    }
                }
                return true;
            };


            /**
             * Download and write all version variables
             */
            $scope.loadData = function() {

                $scope.values = {};
                $scope.val1 = {};

                $scope.versions = {};
                $scope.liveVersion = {};

                var _loadVariables = function(instance) {
                    for (var i in $scope.versions[instance]) {
                        var version = $scope.versions[instance][i];
                        var request = {
                            method: 'GET',
                            url: API_URL + '/v1/pkg/' + $stateParams.domain + '/' + instance + '/' + $scope.editorService.service + '/' + version,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        };

                        $scope.requestsCounter++;
                        $http(request)
                            .success(function (data, status, headers, config) {
                                $scope.requestsCounter--;
                                $scope.loaded = true;

                                var splitedUrl = config.url.split('/');

                                var version = splitedUrl[splitedUrl.length - 1],
                                    instance = splitedUrl[splitedUrl.length - 3];

                                $scope.selectedVersion[instance] = version;

                                for (var varName in data) {
                                    if (!$scope.values[varName]) {
                                        $scope.values[varName] = {};
                                    }

                                    if (!$scope.values[varName][instance]) {
                                        $scope.values[varName][instance] = {};
                                    }

                                    $scope.values[varName][instance][version] = data[varName];
                                }
                            })
                            .error(function (error, status, headers, request) {
                                $scope.requestsCounter--;

                                $scope.loaded = true;
                            });
                    }
                };

                $scope.editorService.instances.forEach(function (instance) {
                    var loadVersionsRequest = {
                        method: 'GET',
                        url: API_URL + '/v1/pkg/' + $stateParams.domain + '/' + instance + '/' + $scope.editorService.service + '/',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    $scope.requestsCounter++;
                    $http(loadVersionsRequest)
                        .success(function(response, code, headers, config) {
                            $scope.requestsCounter--;
                            for (var i in response) {
                                if (!$scope.versions[instance]) {
                                    $scope.versions[instance] = [];
                                }

                                $scope.versions[instance].push(i);
                                if (response[i]) {
                                    $scope.liveVersion[instance] = i;
                                    $scope.selectedVersion[instance] = i;
                                }
                            }

                            _loadVariables(instance);
                        });
                });

            };

            $scope.loadData();
        });

        /**
         * Checks that candidate is exist in instance array of current selected service
         * @param candidate Value to check
         * @returns {boolean}
         */
        var isInstance = function (candidate) {
            for (var i in $scope.editorService.instances) {
                if ($scope.editorService.instances[i] == candidate) {
                    return true;
                }
            }
            return false
        };

        /**
         * Change selected version in the table header
         * @param instance Instance name for version change
         * @param newVersion version to change
         */
        $scope.changeSelectedVersion = function (instance, newVersion) {
            $scope.selectedVersion[instance] = newVersion;
        };

        /**
         * Checks that version in instance has live status
         * @param instance
         * @param version
         * @returns {boolean}
         */
        $scope.isLive = function (instance, version) {
            return $scope.liveVersion[instance] == version;
        };

        $scope.makeLive = function(instance, version) {
            $('span[instance='+instance+'].set-live-button').addClass('loading').text('Loading...');

            var postRequest = {
                method: 'POST',
                url: API_URL + '/v1/pkg/' + $stateParams.domain + '/' + instance + '/' + $scope.editorService.service + '/' + version + '/live',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            $http(postRequest)
                .success(function(response, code) {
                    Notification.success('Live version for ' + instance + ' has been changed.');
                    $('span[instance='+instance+'].set-live-button').removeClass('loading').text('Set live');
                    $scope.editorService.live[instance] = version;
                })
                .error(function(e) {
                    var error = e ? e.error : 'unknown server error';
                    Notification.error('Can\'t load data: ' + error);
                    $('span[instance='+instance+'].set-live-button').removeClass('loading').text('Set live');
                });
        };

        var hasOwnProperty = Object.prototype.hasOwnProperty;

        function isEmpty(obj) {

            if (obj == null) return true;

            if (obj.length > 0)    return false;
            if (obj.length === 0)  return true;

            for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) return false;
            }

            return true;
        }

        /**
         * Checks that we have something to save (using for displaying save button)
         * @returns {boolean}
         */
        $scope.isSavable = function () {
            return !isEmpty($scope.itemsForSave) || !isEmpty($scope.itemsForDelete);
        };

        $scope.makeCopy = function(instance, version) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newVersionModal.html',
                controller: function($scope, $modalInstance, version, instance, instances) {
                    $scope.newVersionName = '';

                    $scope.version = version;
                    $scope.instance = instance;
                    $scope.instances = instances;

                    $scope.targetInstance = '';

                    $scope.ok = function () {
                        if (!$scope.newVersionName || !$scope.targetInstance) {
                            return;
                        }
                        save($scope.newVersionName, $scope.targetInstance, $modalInstance);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    version: function() {
                        return version;
                    },
                    instance: function() {
                        return instance;
                    },
                    instances: function() {
                        return $scope.service.instances;
                    }
                }
            });

            var save = function(newVersionName, targetInstance, $modalInstance) {
                if (!newVersionName || !targetInstance) {
                    return;
                }

                var data = {};

                for (var i in $scope.values) {
                    if (!$scope.values[i][instance] || !$scope.values[i][instance][version]) {
                        continue;
                    }
                    data[i] = $scope.values[i][instance][version];
                }

                $('#config-modal-ok-button').button('loading');

                var postRequest = {
                    method: 'POST',
                    url: API_URL + '/v1/pkg/' + $stateParams.domain + '/' + targetInstance + '/' + $scope.editorService.service + '/' + newVersionName,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                $http(postRequest)
                    .success(function(d, status) {
                        $scope.editorService.versions.push(newVersionName);
                        for (var i in $scope.deletedVersions) {
                            if (i != targetInstance) {
                                $scope.deletedVersions[i].push(newVersionName);
                            }
                        }

                        for (i in data) {
                            $scope.values[i][targetInstance][newVersionName] = $scope.values[i][instance][version];
                        }

                        $scope.changeSelectedVersion(targetInstance, newVersionName);

                        Notification.success('Copy created');

                        $modalInstance.close();
                    })
                    .error(function(e) {
                        $('#config-modal-ok-button').button('reset');
                        Notification.error('Data sending error: ' + e.error);
                    })
            };
        };

        /**
         * Listener for save button
         */
        $scope.save = function () {
            $('#env-save-button').button('loading');
            for (var instance in $scope.itemsForSave) {
                var versions = $scope.itemsForSave[instance];
                for (var version in versions) {
                    var data = $scope.itemsForSave[instance][version];
                    var request = {
                        method: 'PUT',
                        url: API_URL + '/v1/pkg/' + $scope.domain.id + '/' + instance + '/' + $scope.editorService.service + '/' + version,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: data
                    };

                    $http(request)
                        .success(function (response) {
                            Notification.success('Saved successfully');
                            $('#env-save-button').button('reset');
                        })
                        .error(function (error) {
                            Notification.error('Saving error: ' + error.error);
                            $('#env-save-button').button('reset');
                        });
                }
            }

            $scope.itemsForSave = {};
        };


        /**
         * Calling after editing of some variable
         * @param name name of the edited variable
         * @param newValue
         * @param instance
         * @param version
         */
        $scope.updateValues = function (name, newValue, instance, version) {
            if (!$scope.itemsForSave[instance]) {
                $scope.itemsForSave[instance] = [];
            }

            if (!$scope.itemsForSave[instance][version]) {
                $scope.itemsForSave[instance][version] = {};
            }

            $scope.itemsForSave[instance][version][name] = newValue;
        };
    }

    angular.module('qorDash.configurations.services.state.packages.editor')
        .controller('PackagesEditorController', packagesEditorController);
})();
