(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.info')
        .controller('DockerInfoController', dockerInfoController);

    function dockerInfoController(Settings, resolvedDockerInfo, resolvedSystemInfo) {
        var vm = this;
        vm.docker = resolvedDockerInfo;
        vm.info = resolvedSystemInfo;
        vm.endpoint = Settings.endpoint;
    }
    
})();
