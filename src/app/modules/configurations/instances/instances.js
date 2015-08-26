(function () {
    'use strict';

    instancesController.$inject = ['$scope', '$state', '$stateParams', '$http', 'API_URL'];
    function instancesController($scope, $state, $stateParams, $http, API_URL) {

        // TODO Make global
        Object.filter = function( obj, predicate) {
            var key;

            for (key in obj) {
                if (obj.hasOwnProperty(key) && predicate(key)) {
                    return obj[key];
                }
            }
        };

        $scope.checked = {};

        $http.get(API_URL + '/v1/env/' + $stateParams.domain + '/')
            .success(function (response) {
                $scope.service = response[$state.params.service];
                $scope.instances = $scope.service.instances;
                $scope.instances.forEach(function(instance) {
                    $scope.saveAvailableHelper++;
                    $scope.checked[instance] = true;
                });

                if ($state.params.instances) {
                    for (var i in $scope.checked) {
                        $scope.checked[i] = false;
                    }
                    $state.params.instances.split(',').forEach(function(instance){
                        if ($scope.checked[instance] != 'undefined') {
                            $scope.checked[instance] = true;
                            $scope.saveAvailableHelper++;
                        }
                    });
                }

            })
            .error(function (response, status) {
                // TODO Add error message
            });

        $scope.saveAvailableHelper = 0;

        $scope.changeState = function(val) {
            if (val) {
                $scope.saveAvailableHelper++;
            } else {
                $scope.saveAvailableHelper--;
            }
        };

        $scope.show = function() {
            var selectedInstances = [];
            for (var i in $scope.checked) {
                if ($scope.checked[i]) {
                    selectedInstances.push(i);
                }
            }
            if (selectedInstances.length > 0) {
                $state.go('app.configurations.services.state.instances.editor', {instances: selectedInstances});
            }
        }

    }

    angular.module('qorDash.configurations.services.state.instances')
        .controller('InstancesController', instancesController);
})();
