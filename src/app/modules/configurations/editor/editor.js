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

    editorController.$inject = ['$scope', '$stateParams', 'services', 'domains', 'API_URL', '$http', '$timeout'];
    function editorController($scope, $stateParams, services, domains, API_URL, $http, $timeout) {
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

        $scope.values = [];
        $scope.val1 = {};
//
//        $scope.$watch('val1', function(n, o) {
//            formatValues();
//        }, true);


        $scope.service.instances.forEach(function(instance) {
            for (var i in $scope.service.versions) {
                var version = $scope.service.versions[i];
                var request = {
                    method: 'GET',
                    url: 'https://ops-dev.blinker.com/v1/env/blinker.com/ops-dev/blinker/develop',
                    //url: API_URL + '/v1/env/'+$scope.domain.id+'/'+instance+'/'+$scope.service.service+'/'+version,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    'version': version
                };

                $http(request)
                    .success(function(data, status, headers, config) {
                        var url = config.url.split('/');
                        var version = config.version;
                        data.forEach(function(variable) {
                            if (!$scope.val1[variable.name]) {
                                $scope.val1[variable.name] = {};
                            }

                            if (!$scope.val1[variable.name][instance]) {
                                $scope.val1[variable.name][instance] = {};
                            }

                            if (!$scope.val1[variable.name][instance][version]) {
                                $scope.val1[variable.name][instance][version] = {};
                            }

                            $scope.val1[variable.name][instance][version] = variable.value + version;
                        });
                        if (instance == $scope.service.instances[$scope.service.instances.length - 1]
                            && version == $scope.service.versions[$scope.service.versions.length - 1]) {
                            formatValues();
                        }
                    })
            }
        });



        function formatValues() {
            debugger;
            for (var index in $scope.val1) {
                $scope.val1[index]['name'] = index;
                $scope.values.push($scope.val1[index]);
            }
        }

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
