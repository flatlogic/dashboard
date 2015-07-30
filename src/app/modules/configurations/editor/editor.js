(function () {
    'use strict';

    angular.module('qorDash.configurations')
        .value('services', [
            {
                "service": "blinker",
                "instances": [ "ops-dev" ],
                "versions": [ "develop", "v1.0", "v1.1" ],
                "live": {
                    "ops-dev": "develop"
                }
            },
            {
                "service": "vdp",
                "instances": [ "ops-dev", "staging", "production" ],
                "versions": [ "v0.1", "v1.0" ],
                "live": {
                    "ops-dev": "v1.0",
                    "staging": "v0.1",
                    "production": "v0.1"
                }
            }
        ]);

    editorController.$inject = ['$scope', '$stateParams', 'services', 'API_URL', '$http'];
    function editorController($scope, $stateParams, services, API_URL, $http) {

        $scope.selectedVersion = {};

        $scope.itemsForSave = {};
        $scope.itemsForDelete = [];
        $scope.newItemsCount = 0;

        $scope.dashVersions = {};

        $scope.values = [];
        $scope.val1 = {};

        $scope.domain = $scope.domains.filter(function (domain) {
            return domain.id == $stateParams.domain;
        })[0];

        $scope.service = services.filter(function (service) {
            return service.service == $stateParams.service;
        })[0];

        $scope.service.instances.forEach(function (instance) {
            $scope.selectedVersion[instance] = $scope.service.versions[0];
        });

        var isInstance = function (candidate) {
            for (var i in $scope.service.instances) {
                if ($scope.service.instances[i] == candidate) {
                    return true;
                }
            }
            return false
        };

        $scope.changeSelectedVersion = function (instance, newVersion) {
            $scope.selectedVersion[instance] = newVersion;
        };

        $scope.isLive = function (instance, version) {
            return $scope.service.live[instance] == version;
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

        $scope.isSavable = function () {
            return !isEmpty($scope.itemsForSave) || !isEmpty($scope.itemsForDelete);
        };

        $scope.save = function () {
            $('#env-save-button').button('loading');

            if (!$scope.itemsForSave && $scope.itemsForDelete.length != 0) {
                // TODO send delete request
            }

            if ($scope.newItemsCount != 0) {
                for (var i = $scope.values.length - 1; $scope.newItemsCount; $scope.newItemsCount--) {
                    var objToAdd = $scope.values[i];
                    for (var index in objToAdd) {
                        if (isInstance(index)) {
                            var versionToAdd = objToAdd[index];
                            for (var versionIndex in versionToAdd) {
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
                    data['delete'] = $scope.itemsForDelete;
                    var request = {
                        method: 'PATCH',
                        url: API_URL + '/v1/env/' + $scope.domain.id + '/' + instance + '/' + $scope.service.service + '/' + version,
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Dash-Version': $scope.dashVersions[version]
                        },
                        data: data
                    };
                    $http(request)
                        .success(function (response) {
                            debugger;
                            $('#env-save-button').button('reset');
                        })
                        .error(function () {
                            debugger;
                            $('#env-save-button').button('reset');
                        });
                }
            }

            $scope.itemsForSave = {};
            $scope.itemsForDelete = [];
        };

        $scope.addValue = function () {
            var obj = {};
            obj.name = "";
            $scope.service.instances.forEach(function (instance) {
                obj[instance] = {};
                $scope.service.versions.forEach(function (version) {
                    obj[instance][version] = "";
                });
            });
            $scope.values.push(obj);
            $scope.newItemsCount++;
        };


        $scope.service.instances.forEach(function (instance) {
            for (var i in $scope.service.versions) {
                var version = $scope.service.versions[i];
                var request = {
                    method: 'GET',
                    //url: 'https://ops-dev.blinker.com/v1/env/blinker.com/ops-dev/blinker/develop',
                    url: API_URL + '/v1/env/' + $scope.domain.id + '/' + instance + '/' + $scope.service.service + '/' + version,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    'version': version
                };

                $http(request)
                    .success(function (data, status, headers, config) {
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

                            $scope.val1[varName][instance][version]['value'] = data[varName] + version;

                            $scope.dashVersions[version] = headers('X-Dash-Version');
                        }
                        if (instance == $scope.service.instances[$scope.service.instances.length - 1]
                            && version == $scope.service.versions[$scope.service.versions.length - 1]) {
                            formatValues();
                        }
                    })
            }
        });

        function formatValues() {
            for (var index in $scope.val1) {
                $scope.val1[index]['name'] = index;
                $scope.values.push($scope.val1[index]);
            }
        }

        $scope.updateValues = function (name, newValue, instance, version) {
            if (!$scope.itemsForSave[instance]) {
                $scope.itemsForSave[instance] = [];
            }

            if (!$scope.itemsForSave[instance][version]) {
                $scope.itemsForSave[instance][version] = {
                    'update': {}
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

        $scope.deleteValue = function (name) {

            $scope.itemsForDelete.push(name);

            for (var valueIndex in $scope.values) {
                if ($scope.values[valueIndex].name == name) {
                    $scope.values.splice(valueIndex, 1);
                    return;
                }
            }
        }
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
                instance: '='
            },
            link: function (scope, elm, attr) {
                var previousValue;

                scope.edit = function () {
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
                    for (var versionIndex in scope.parent) {
                        if (!scope.parent[versionIndex]) {
                            return;
                        }
                    }
                    if (!scope.model) {
                        return;
                    }
                    scope.editMode = false;
                    scope.handleSave({name: scope.key, newValue: scope.model, instance: scope.instance, version: scope.version});
                };

                scope.isSaveAvailable = function () {
                    for (var versionIndex in scope.parent) {
                        if (!scope.parent[versionIndex]) {
                            return false;
                        }
                    }
                    return true;
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
                    scope.edit();
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
