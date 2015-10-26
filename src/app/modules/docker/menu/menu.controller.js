(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu')
        .controller('DockerMenuController', dockerMenuController);

    function dockerMenuController($stateParams) {
        var vm = this;
        vm.dockerId = $stateParams.dockerId;
    }

})();
