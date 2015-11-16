(function () {
    'use strict';

    angular
        .module('qorDash.configurations.services.state.instances')
        .controller('InstancesController', instancesController);

    function instancesController($scope, $state, resolvedEnv) {
        $scope.saveAvailableHelper = 0;
        $scope.checked = {};
        $scope.service = resolvedEnv[$state.params.service];
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
                $state.go('.editor', {instances: selectedInstances});
            }
        };

    }
})();
