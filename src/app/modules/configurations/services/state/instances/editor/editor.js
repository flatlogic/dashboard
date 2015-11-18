(function () {
    'use strict';

    angular.module('qorDash.configurations.services.state.instances.editor')
        .config(function(NotificationProvider) {
            NotificationProvider.setOptions({
                delay: 5000,
                positionX: 'right',
                positionY: 'bottom'
            });
        });

    editorController.$inject = ['$scope', '$stateParams', 'API_HOST', '$http', '$modal', 'Notification', '$timeout', 'errorHandler'];
    function editorController($scope, $stateParams, API_HOST, $http, $modal, Notification, $timeout, errorHandler) {

        $scope.selectedVersion = {};

        $scope.itemsForSave = {};
        $scope.newItemsCount = 0;

        $scope.dashVersions = {};

        $scope.values = [];
        $scope.val1 = {};

        $scope.requestsCounter = 0;

        $scope.versions = {};
        $scope.liveVersion = {};

        $scope.createVersion = function(instance, newVersionName) {
            var request = {
                method: 'POST',
                url: API_HOST + '/v1/env/' + $stateParams.domain + '/'
                    + instance + '/' + $scope.service.service + '/' + newVersionName
            };

            return $http(request).then(
                function(response) {
                    Notification.success('Successfully created');
                },
                function(response) {
                    errorHandler.showError(response.data, response.status);
                }
            );
        };

        $scope.clickAddNewVersion = function(instance) {
            $modal.open({
                animation: true,
                templateUrl: 'app/modules/configurations/services/state/instances/editor/new-version-modal.html',
                controller: 'EditorNewVersionController',
                size: 'sm',
                resolve: {
                    createVersion: function () {
                        return $scope.createVersion;
                    },
                    instance: function () {
                        return instance;
                    }
                }
            });
        };

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

            /**
             * Download and write all version variables
             */
            $scope.loadData = function() {

                $scope.values = [];
                $scope.val1 = {};
                $scope.deledVersions = {};
                $scope.versions = {};
                $scope.liveVersion = {};

                var _loadVariables = function(instance) {
                    for (var i in $scope.versions[instance]) {
                        var version = $scope.versions[instance][i];
                        var request = {
                            method: 'GET',
                            url: API_HOST + '/v1/env/' + $stateParams.domain + '/' + instance + '/' + $scope.editorService.service + '/' + version,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            'version': version
                        };

                        $scope.requestsCounter++;
                        $http(request).then(
                            function (response) {
                                $scope.requestsCounter--;
                                $scope.loaded = true;

                                var version = response.config.version;
                                for (var varName in response.data) {
                                    if (!$scope.val1[varName]) {
                                        $scope.val1[varName] = {};
                                    }

                                    if (!$scope.val1[varName][instance]) {
                                        $scope.val1[varName][instance] = {};
                                    }

                                    if (!$scope.val1[varName][instance][version]) {
                                        $scope.val1[varName][instance][version] = {};
                                    }

                                    if (response.data[varName]) {
                                        $scope.val1[varName][instance][version]['value'] = response.data[varName];
                                    } else {
                                        $scope.val1[varName][instance][version]['value'] = '-';
                                    }

                                    if (!$scope.dashVersions[instance]) {
                                        $scope.dashVersions[instance] = {};
                                    }
                                    $scope.dashVersions[instance][version] = response.headers('X-Dash-Version');
                                }
                                if ($scope.requestsCounter <= 0) {
                                    formatValues();
                                }
                            },
                            function (response) {
                                $scope.requestsCounter--;

                                $scope.loaded = true;

                                if ($scope.requestsCounter <= 0) {
                                    formatValues();
                                }
                            }
                        );
                    }
                };

                $scope.editorService.instances.forEach(function (instance) {

                    var loadVersionsRequest = {
                        method: 'GET',
                        url: API_HOST + '/v1/env/' + $stateParams.domain + '/' + instance + '/' + $scope.editorService.service + '/',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    $scope.requestsCounter++;
                    $http(loadVersionsRequest).then(
                        function(response) {
                            $scope.requestsCounter--;
                            for (var i in response.data) {
                                if (!$scope.versions[instance]) {
                                    $scope.versions[instance] = [];
                                }

                                $scope.versions[instance].push(i);
                                if (response.data[i]) {
                                    $scope.liveVersion[instance] = i;
                                    $scope.selectedVersion[instance] = i;
                                }
                            }

                            _loadVariables(instance);
                        },
                        function(response) {

                        }
                    );
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

        $scope.makeLive = function(instance, version) {
            $('span[instance='+instance+'].set-live-button').addClass('loading').text('Loading...');

            var postRequest = {
                method: 'POST',
                url: API_HOST + '/v1/env/' + $stateParams.domain + '/' + instance + '/' + $scope.editorService.service + '/' + version + '/live',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            $http(postRequest).then(
                function(response) {
                    Notification.success('Live version for ' + instance + ' has been changed.');
                    $('span[instance='+instance+'].set-live-button').removeClass('loading').text('Set live');
                    $scope.editorService.live[instance] = version;
                },
                function(response) {
                    //TODO Add error handler
                    $('span[instance='+instance+'].set-live-button').removeClass('loading').text('Set live');
                }
            );
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
                $('#config-modal-ok-button').button('loading');
                if (!newVersionName || !targetInstance) {
                    return;
                }

                var getRequest = {
                    method: 'GET',
                    url: API_HOST + '/v1/env/' + $stateParams.domain + '/' + instance + '/' + $scope.editorService.service + '/' + version,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    'version': version
                };

                var newVars = {};

                $http(getRequest).then(
                    function(response) {
                        newVars = response.data;

                        var patchRequest = {
                            method: 'POST',
                            url: API_HOST + '/v1/env/' + $stateParams.domain + '/' + targetInstance + '/' + $scope.editorService.service + '/' + newVersionName,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: data
                        };

                        $http(patchRequest).then(
                            function(response) {
                                $scope.versions[targetInstance].push(newVersionName);

                                for (var i in $scope.values) {

                                    if (!$scope.values[i][targetInstance]) {
                                        continue;
                                    }

                                    $scope.values[i][targetInstance][newVersionName] = {
                                        value: newVars[$scope.values[i].name]
                                    };
                                }

                                Notification.success('Copy created');

                                $modalInstance.close();
                            },
                            function(response) {
                                $('#config-modal-ok-button').button('reset');
                                //TODO Add error handler
                            });
                    },
                    function(response) {
                        $('#config-modal-ok-button').button('reset');
                        //TODO Add error handler
                    }
                );
            };
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
                        url: API_HOST + '/v1/env/' + $scope.domain.id + '/' + instance + '/' + $scope.editorService.service + '/' + version,
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Dash-Version': $scope.dashVersions[instance] ? $scope.dashVersions[instance][version] || '' : ''
                        },
                        data: data
                    };
                    if (request.data.delete) {
                        $http(request).then(
                            function (response) {
                                Notification.success('Saved successfully');
                                $('#env-save-button').button('reset');
                                $scope.loadData();
                            },
                            function (response) {
                                //TODO Add error handler
                                $('#env-save-button').button('reset');
                            }
                        );
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
            $('.editor-content').parent().scrollTop($('.editor-content').height() + 80);
            var obj = {};
            obj.name = "";
            $scope.editorService.instances.forEach(function (instance) {
                obj[instance] = {};
                $scope.versions[instance].forEach(function (version) {
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

            if (!name) {
                return;
            }

            for (var i in $scope.editorService.instances) {
                if ($scope.values[i][$scope.editorService.instances[i]][$scope.selectedVersion[$scope.editorService.instances[i]]]) {
                    if ($scope.values[i][$scope.editorService.instances[i]][$scope.selectedVersion[$scope.editorService.instances[i]]].value.length != 0) {
                        $scope.deleteValue(name, $scope.editorService.instances[i], $scope.selectedVersion[$scope.editorService.instances[i]]);
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
                        var textarea = elm.find('textarea')[0];
                        textarea.style.height = textarea.scrollHeight + "px";
                        textarea.focus();
                    }, 0, false);
                };
                scope.save = function () {
                    scope.editMode = false;

                    if (!scope.model) {
                        scope.showEdit = true;
                    }

                    if (scope.model != scope.oldValue) {
                        scope.handleSave({name: scope.key, newValue: scope.model, instance: scope.instance, version: scope.version});
                    }
                };

                scope.isSaveAvailable = function () {
                    return true;
                };

                scope.isDeleteUnavailable = function() {
                    return scope.isName || scope.editMode || !scope.model;
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

    newVersionController.$inject = ['$scope', 'createVersion', '$modalInstance', 'instance'];
    function newVersionController($scope, createVersion, $modalInstance, instance) {
        $scope.instance = instance;
        $scope.ok = function ($event) {
            if (!$scope.versionName) {
                return;
            }

            $scope.event = $event;

            $($event.target).button('loading');

            createVersion(instance, $scope.versionName).then(
                function() {
                    $modalInstance.close();
                },
                function() {
                    $($scope.event.target).button('reset');
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }

    angular.module('qorDash.configurations.services.state.instances.editor')
        .controller('EditorController', editorController)
        .directive('inlineEdit', inlineEdit)
        .directive('onEnter', onEnter)
        .directive('onEsc', onEsc)
        .directive('addValue', addValue)
        .directive('customSelect', customSelect)
        .controller('EditorNewVersionController', newVersionController);
})();