(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.containers.container.top')
        .controller('DockerContainerTopController', dockerContainerTopController);


    function dockerContainerTopController($stateParams, ContainerTop) {
        var vm = this;

        /**
         * Get container processes
         */
        vm.getTop = function () {
            ContainerTop.get($stateParams.containerId, {
                ps_args: vm.ps_args
            }, function (data) {
                vm.containerTop = data;
            });
        };

        vm.getTop();
    }
})();
