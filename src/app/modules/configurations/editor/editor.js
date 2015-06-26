(function() {
    'use strict';

    angular.module('qorDash.configurations')
        .value('services', [
            {
                "service": "blinker",
                "instances": [ "ops-dev", "staging", "production" ],
                "versions":[ "develop", "v1.0", "v1.1" ]
            },
            {
                "service": "vdp",
                "instances": [ "ops-dev", "staging", "production" ],
                "versions":[ "v0.1", "v1.0" ]
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

        $scope.values = [
            {
                "name": "PGHOST",
                "value": "ops-dev.blinker.io"
            },
            {
                "name": "PGPORT",
                "value": "5432"
            },
            {
                "name": "PGUSER",
                "value": "blinker"
            },
            {
                "name": "PGDATABASE",
                "value": "blinkerdb"
            },
            {
                "name": "PGPASSWORD",
                "value": "password"
            }
        ];

        $scope.updateValues = function(value, pValue) {
            for (var valueIndex in $scope.values) {
                if ($scope.values[valueIndex].value == pValue) {
                    $scope.values[valueIndex].value = value;
                    return;
                }
            }
        };

        $scope.deleteValue = function(name) {
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
                handleSave: '&onSave',
                handleCancel: '&onCancel'
            },
            link: function(scope, elm, attr) {
                var previousValue;

                scope.edit = function() {
                    scope.editMode = true;
                    scope.previousValue = scope.model;

                    $timeout(function() {
                        elm.find('input')[0].focus();
                    }, 0, false);
                };
                scope.save = function() {
                    scope.editMode = false;
                    scope.handleSave({value: scope.model, pValue: scope.previousValue});
                };
                scope.cancel = function() {
                    scope.editMode = false;
                    scope.model = previousValue;
                    scope.handleCancel({value: scope.model});
                };
            },
            templateUrl: 'inlineEdit.html'
        };
    }

    angular.module('qorDash.configurations')
        .controller('EditorController', editorController)
        .directive('inlineEdit', inlineEdit)
        .directive('onEnter', onEnter)
        .directive('onEsc', onEsc);
})();
