(function () {
    'use strict';

    angular.module('qorDash.configurations');

    editorController.$inject = ['$scope', '$stateParams', 'API_URL', '$http', '$modal'];
    function editorController($scope, $stateParams, API_URL, $http, $modal) {

        $scope.selectedVersion = {};

        $scope.itemsForSave = {};
        $scope.newItemsCount = 0;

        $scope.dashVersions = {};

        $scope.values = [];
        $scope.val1 = {};

        $scope.requestsCounter = 0;

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

        $scope.$watch('services', function() {
            if (!$scope.services) {
                return;
            }

            $scope.editorService = Object.filter($scope.services, function(key) {
                return $stateParams.service == key;
            });

            $scope.editorService = JSON.parse(JSON.stringify($scope.editorService));

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

                $scope.values = [];
                $scope.val1 = {};

                $scope.editorService.instances.forEach(function (instance) {
                    for (var i in $scope.editorService.versions) {
                        var version = $scope.editorService.versions[i];
                        var request = {
                            method: 'GET',
                            url: API_URL + '/v1/env/' + $stateParams.domain + '/' + instance + '/' + $scope.editorService.service + '/' + version,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            'version': version
                        };

                        $scope.requestsCounter++;
                        $http(request)
                            .success(function (data, status, headers, config) {
                                $scope.requestsCounter--;
                                var version = config.version;
                                for (var varName in data) {
                                    if (!$scope.val1[varName]) {
                                        $scope.val1[varName] = {};
                                    }

                                    if (!$scope.val1[varName][instance]) {
                                        $scope.val1[varName][instance] = {};
                                    }

                                    if (!$scope.val1[varName][instance][version]) {
                                        $scope.val1[varName][instance][version] = {};
                                    }

                                    if (data[varName]) {
                                        $scope.val1[varName][instance][version]['value'] = data[varName];
                                    } else {
                                        $scope.val1[varName][instance][version]['value'] = '-';
                                    }

                                    if (!$scope.dashVersions[instance]) {
                                        $scope.dashVersions[instance] = {};
                                    }
                                    $scope.dashVersions[instance][version] = headers('X-Dash-Version');
                                }
                                if ($scope.requestsCounter <= 0) {
                                    formatValues();
                                }
                            })
                            .error(function (error, status, headers, request) {
                                $scope.requestsCounter--;

                                if (status == 404) {
                                    var splitedUrl = request.url.split('/');

                                    var version = splitedUrl[splitedUrl.length - 1],
                                        instance = splitedUrl[splitedUrl.length - 3];

                                    if (!$scope.deletedVersions[instance]) {
                                        $scope.deletedVersions[instance] = [];
                                    }

                                    $scope.deletedVersions[instance].push(version);
                                }

                                if ($scope.requestsCounter <= 0) {
                                    formatValues();
                                }
                            });
                    }
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
            return $scope.editorService.live[instance] == version;
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
                        $modalInstance.close([$scope.newVersionName, $scope.targetInstance]);
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

            modalInstance.result.then(function (resultArray) {
                var newVersionName = resultArray[0],
                    targetInstance = resultArray[1];

                if (!newVersionName || !targetInstance) {
                    return;
                }

                var getRequest = {
                    method: 'GET',
                    url: API_URL + '/v1/env/' + $stateParams.domain + '/' + instance + '/' + $scope.editorService.service + '/' + version,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    'version': version
                };

                $http(getRequest)
                    .success(function(data, status) {
                        debugger;
                        var patchRequest = {
                            method: 'PATCH',
                            url: API_URL + '/v1/env/' + $stateParams.domain + '/' + targetInstance + '/' + $scope.editorService.service + '/' + newVersionName,
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Dash-Version': $scope.dashVersions[instance][version]
                            },
                            data: {
                                'update' : data
                            }
                        };

                        $http(patchRequest)
                            .success(function(data, status) {
                                debugger;
                            })
                            .error(function(error, status) {
                                debugger;
                            });
                    })
                    .error(function(s) {
                        debugger;
                    });
            });
        };

        /**
         * Listener for save button
         */
        $scope.save = function () {
            $('#env-save-button').button('loading');

            // Add new items to array for saving
            if ($scope.newItemsCount != 0) {
                for (var i = $scope.values.length - 1; $scope.newItemsCount; $scope.newItemsCount--) {
                    var objToAdd = $scope.values[i];
                    for (var index in objToAdd) {
                        if (isInstance(index)) {
                            var versionToAdd = objToAdd[index];
                            for (var versionIndex in versionToAdd) {

                                if (!$scope.itemsForSave[index]) {
                                    $scope.itemsForSave[index] = {};
                                }

                                if (!$scope.itemsForSave[index][versionIndex]) {
                                    $scope.itemsForSave[index][versionIndex] = {};
                                }

                                if (!$scope.itemsForSave[index][versionIndex]['update']) {
                                    $scope.itemsForSave[index][versionIndex]['update'] = {};
                                }

                                $scope.itemsForSave[index][versionIndex]['update'][objToAdd.name] = versionToAdd[versionIndex].value;
                            }
                        }
                    }
                }
            }

            for (var instance in $scope.itemsForSave) {
                var versions = $scope.itemsForSave[instance];
                for (var version in versions) {
                    var data = $scope.itemsForSave[instance][version];
                    var request = {
                        method: 'PATCH',
                        url: API_URL + '/v1/env/' + $scope.domain.id + '/' + instance + '/' + $scope.editorService.service + '/' + version,
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Dash-Version': $scope.dashVersions[instance][version]
                        },
                        data: data
                    };
                    if (request.data.delete) {
                        $http(request)
                            .success(function (response) {
                                alert('Saved successfully');
                                $('#env-save-button').button('reset');
                                $scope.loadData();
                            })
                            .error(function (error) {
                                alert('Saving error' + error);
                                console.log(error);
                                $('#env-save-button').button('reset');
                            });
                    }
                }
            }

            $scope.itemsForSave = {};
            $scope.itemsForDelete = [];
        };

        /**
         * Add value listener. Add empty value to items array and increment new items count.
         */
        $scope.addValue = function () {
            var obj = {};
            obj.name = "";
            $scope.editorService.instances.forEach(function (instance) {
                obj[instance] = {};
                $scope.editorService.versions.forEach(function (version) {
                    obj[instance][version] = "";
                });
            });
            $scope.values.push(obj);
            $scope.newItemsCount++;
        };

        /**
         * Format downloaded variables to the displaying array
         */
        function formatValues() {
            for (var index in $scope.val1) {
                $scope.val1[index]['name'] = index;
                $scope.values.push($scope.val1[index]);
            }
        }

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
                $scope.itemsForSave[instance][version] = {
                    'update': {},
                    'delete': []
                };
            }
            $scope.itemsForSave[instance][version].update[name] = newValue;

            for (var valueIndex in $scope.values) {
                if ($scope.values[valueIndex].name == name) {
                    $scope.values[valueIndex].value = newValue;
                    return;
                }
            }
        };

        $scope.deleteValue = function(name, instance, version) {
            if (!$scope.itemsForSave[instance]) {
                $scope.itemsForSave[instance] = [];
            }

            if (!$scope.itemsForSave[instance][version]) {
                $scope.itemsForSave[instance][version] = {
                    'update': {},
                    'delete': [name]
                };
                return;
            }

            $scope.itemsForSave[instance][version].delete.push(name);
        };

        $scope.deleteInAllVersions = function(name) {

            for (var i in $scope.values) {
                if ($scope.values[i].name == name) {
                    $scope.values.splice(i, 1);
                }
            }

            for (var i in $scope.editorService.instances) {
                for (var j in $scope.editorService.versions) {
                    if (!$scope.isVersionDeleted($scope.editorService.instances[i], $scope.editorService.versions[j])) {
                        $scope.deleteValue(name, $scope.editorService.instances[i], $scope.editorService.versions[j]);
                    }
                }
            }
        };
    }

    function onEnter() {
        return function (scope, elm, attr) {
            elm.bind('keypress', function (e) {
                if (e.keyCode === 13) {
                    scope.$apply(attr.onEnter);
                }
            });
        };
    }

    function onEsc() {
        return function (scope, elm, attr) {
            elm.bind('keydown', function (e) {
                if (e.keyCode === 27) {
                    scope.$apply(attr.onEsc);
                }
            });
        };
    }

    inlineEdit.$inject = ['$timeout'];
    function inlineEdit($timeout) {
        return {
            scope: {
                model: '=inlineEdit',
                key: '=key',
                handleSave: '&onSave',
                handleCancel: '&onCancel',
                handleDelete: '&onDelete',
                isName: '=isName',
                parent: '=',
                version: '=',
                instance: '=',
                changeSelected: '=',
                versions: '='
            },
            link: function (scope, elm, attr) {
                var previousValue;

                scope.edit = function () {
                    scope.showEdit = false;

                    scope.oldValue = scope.model;

                    if (scope.isName && scope.model) {
                        return;
                    }

                    scope.editMode = true;
                    scope.previousValue = scope.model;

                    $timeout(function () {
                        elm.find('input')[0].focus();
                    }, 0, false);
                };
                scope.save = function () {
//                    for (var versionIndex in scope.parent) {
//                        if (!scope.parent[versionIndex]) {
//                            return;
//                        }
//                    }
//                    if (!scope.model) {
//                        return;
//                    }
                    scope.editMode = false;

                    if (!scope.model) {
                        scope.showEdit = true;
                    }

                    if (scope.model != scope.oldValue) {
                        scope.handleSave({name: scope.key, newValue: scope.model, instance: scope.instance, version: scope.version});
                    }
                };

                scope.isSaveAvailable = function () {
//                    for (var versionIndex in scope.parent) {
//                        if (!scope.parent[versionIndex]) {
//                            return false;
//                        }
//                    }
                    return true;
                };

                scope.isDeleteUnavailable = function() {
                    return scope.showEdit || scope.isName || scope.editMode || !scope.model;
                };

                scope.isLeftVersionAvailable = function() {
                    var i = 0;
                    for (var versionIndex in scope.versions) {
                        ++i;
                        if (scope.versions[versionIndex] == scope.version) {
                            if (i > 1) {
                                return true;
                            }
                        }
                    }
                    return false;
                };

                scope.isRightVersionAvailable = function() {
                    var i = 0, j = 0;
                    for (var versionIndex in scope.versions) {
                        ++i;
                        if (scope.versions[versionIndex] == scope.version) {
                            j = i;
                        }
                    }
                    return (i - j) > 0;
                };

                scope.changeVersionToTheRight = function() {
                    if (!scope.isRightVersionAvailable()) {
                        return;
                    }

                    var blocked = false;
                    for (var versionIndex in scope.versions) {
                        if (blocked) {
                            scope.changeSelected(scope.instance, scope.versions[versionIndex]);
                            return;
                        }
                        if (scope.versions[versionIndex] == scope.version) {
                            blocked++;
                        }
                    }
                };

                scope.changeVersionToTheLeft = function() {
                    if (!scope.isLeftVersionAvailable()) {
                        return;
                    }

                    var previousVersion = null;
                    for (var versionIndex in scope.versions) {
                        if (scope.versions[versionIndex] == scope.version) {
                            if (!previousVersion) {
                                continue;
                            } else {
                                scope.changeSelected(scope.instance, previousVersion);
                            }
                        }
                        previousVersion = scope.versions[versionIndex];
                    }
                };

                scope.delete = function() {
                  console.log(scope);

                    scope.model = '';
                    scope.showEdit = true;

                    scope.handleDelete({name : scope.key, instance : scope.instance, version : scope.version});
                };

                scope.isEditAvailable = function() {
                    return (scope.model ? false : true) && !scope.editMode;
                };

                scope.cancel = function () {
                    scope.editMode = false;
                    scope.model = previousValue;
                    scope.handleCancel({value: scope.model});
                };

                scope.remove = function (key) {
                    scope.handleDelete({name: key});
                };

                if (!scope.model) {
                    scope.showEdit = true;
                }
            },
            templateUrl: 'inlineEdit.html'
        };
    }

    function addValue() {
        return {
            link: function (scope, element, attrs) {

            },
            templateUrl: 'addNewValue.html'
        }
    }

    function customSelect() {
        return {
            link: function (scope, element, attr) {
                [].slice.call(document.querySelectorAll('select.cs-select')).forEach(function (el) {
                    new SelectFx(el);
                });
            }
        }
    }

    angular.module('qorDash.configurations')
        .controller('EditorController', editorController)
        .directive('inlineEdit', inlineEdit)
        .directive('onEnter', onEnter)
        .directive('onEsc', onEsc)
        .directive('addValue', addValue)
        .directive('customSelect', customSelect);
})();
