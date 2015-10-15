(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.containers.container.top')
        .controller('DockerContainerTopController', dockerContainerTopController);


    function dockerContainerTopController($stateParams, dockerService, resolvedContainerTop) {
        var vm = this;
        vm.containerTop = resolvedContainerTop;

        vm.getTop = function () {
            dockerService
                .getContainerTop($stateParams.containerId, vm.ps_args)
                .then(function(response){
                    vm.containerTop = response;
                });
        };

    }
})();
