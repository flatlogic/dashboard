(function () {
    'use strict';

    angular.module('qorDash.docker.domain.dockers.menu.containers.container.top')
        .controller('DockerContainerTopController', dockerContainerTopController);


    dockerContainerTopController.$inject = ['$scope', '$stateParams', 'ContainerTop'];
    function dockerContainerTopController($scope, $stateParams, ContainerTop) {
        $scope.ps_args = '';

        /**
         * Get container processes
         */
        $scope.getTop = function () {
            ContainerTop.get($stateParams.containerId, {
                ps_args: $scope.ps_args
            }, function (data) {
                $scope.containerTop = data;
            });
        };

        $scope.getTop();
    }
})();
