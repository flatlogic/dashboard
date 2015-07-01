(function() {
    'use strict';

    angular.module('qorDash.configurations')
        .value('services', [
            {
                "service": "blinker",
                "instances": [ "ops-dev", "staging", "production" ],
                "versions":[ "develop", "v1.0", "v1.1" ],
                "live": {
                    "ops-dev" : "develop",
                    "staging" : "v1.0",
                    "production" : "v1.0"
                }
            },
            {
                "service": "vdp",
                "instances": [ "ops-dev", "staging", "production" ],
                "versions":[ "v0.1", "v1.0" ],
                "live": {
                    "ops-dev" : "v1.0",
                    "staging" : "v0.1",
                    "production" : "v0.1"
                }
            }
        ]);

    editorController.$inject = ['$scope', '$stateParams', 'services', 'domains'];
    function editorController($scope, $stateParams, services, domains) {
        $scope.domain = domains.filter(function (domain) {
            return domain.id == $stateParams.domain;
        })[0];

        $scope.service = services.filter(function (service) {
            return service.service == $stateParams.service;
        })[0];

        $scope.selectedVersion = {};

        $scope.service.instances.forEach(function(instance) {
            $scope.selectedVersion[instance] = $scope.service.versions[0];
        });

        $scope.changeSelectedVersion = function(instance, newVersion) {
            $scope.selectedVersion[instance] = newVersion;
        };

        $scope.isLive = function(instance, version) {
            return $scope.service.live[instance] == version;
        };

        $scope.save = function() {
            if (confirm("Are you sure?")) {

            } else {

            }
        };

        $scope.addValue = function() {
            var obj = {};
            obj.name = "";
            $scope.service.instances.forEach(function(instance) {
                obj[instance] = {};
               $scope.service.versions.forEach(function(version) {
                   obj[instance][version] = "";
               });
            });
            $scope.values.push(obj);
        };

        $scope.values = [
            {
                "name": "PGHOST",
                "ops-dev": {
                    "develop": "ops-dev.blinker.io-dev",
                    "v1.0": "ops-dev.blinker.io-v1.0",
                    "v1.1": "ops-dev.blinker.io-v1.1"
                },
                "staging": {
                    "develop": "staging-dev.blinker.io-dev",
                    "v1.0": "staging-dev.blinker.io-v1.0",
                    "v1.1": "staging-dev.blinker.io-v1.1"
                },
                "production": {
                    "develop": "production-dev.blinker.io-dev",
                    "v1.0": "production-dev.blinker.io-v1.0",
                    "v1.1": "production-dev.blinker.io-v1.1"
                }
            },
            {
                "name": "PGPORT",
                "ops-dev": {
                    "develop": "pg-od-dev",
                    "v1.0": "pg-od-v1.0",
                    "v1.1": "pg-od-v1.1"
                },
                "staging": {
                    "develop": "staging-od-dev",
                    "v1.0": "staging-od-v1.0",
                    "v1.1": "staging-od-v1.1"
                },
                "production": {
                    "develop": "production-od-dev",
                    "v1.0": "production-od-v1.0",
                    "v1.1": "production-od-v1.1"
                }
            },
            {
                "name": "PGUSER",
                "ops-dev": {
                    "develop": "pguser-od-dev",
                    "v1.0": "pguser-od-v1.0",
                    "v1.1": "pguser-od-v1.1"
                },
                "staging": {
                    "develop": "staging-pguser-dev",
                    "v1.0": "staging-pguser-v0.1",
                    "v1.1": "staging-pguser-1.0"
                },
                "production": {
                    "develop": "production-od-1",
                    "v1.0": "production-od-2",
                    "v1.1": "production-od-3"
                }
            }
        ];

        $scope.focusinControl = {
        };

        $scope.updateValues = function(name, newValue) {
            for (var valueIndex in $scope.values) {
                if ($scope.values[valueIndex].name == name) {
                    $scope.values[valueIndex].value = newValue;
                    return;
                }
            }
        };

        $scope.deleteValue = function(name) {
            for (var valueIndex in $scope.values) {
                if ($scope.values[valueIndex].name == name) {
                    $scope.values.splice(valueIndex, 1);
                    return;                }
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
        return function(scope, elm, attr) {
            elm.bind('keydown', function(e) {
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
                parent: '='
            },
            link: function(scope, elm, attr) {
                var previousValue;

                scope.edit = function() {
                    if (scope.isName && scope.model) {
                        return;
                    }

                    scope.editMode = true;
                    scope.previousValue = scope.model;

                    $timeout(function() {
                        elm.find('input')[0].focus();
                    }, 0, false);
                };
                scope.save = function() {
                    for (var versionIndex in scope.parent) {
                        if (!scope.parent[versionIndex]) {
                            return;
                        }
                    }
                    if (!scope.model) {
                        return;
                    }
                    scope.editMode = false;
                    scope.handleSave({name: scope.key, newValue: scope.model});
                };

                scope.isSaveAvailable = function() {
                    for (var versionIndex in scope.parent) {
                        if (!scope.parent[versionIndex]) {
                            return false;
                        }
                    }
                    return true;
                };

                scope.cancel = function() {
                    scope.editMode = false;
                    scope.model = previousValue;
                    scope.handleCancel({value: scope.model});
                };

                scope.remove = function(key) {
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
            link: function(scope, element, attrs) {

            },
            templateUrl: 'addNewValue.html'
        }
    }

    function customSelect() {
        return {
            link: function(scope, element, attr) {
                [].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
                    new SelectFx(el);
                } );
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
