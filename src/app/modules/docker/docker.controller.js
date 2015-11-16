(function () {
    'use strict';

    angular
        .module('qorDash.docker')
        .controller('DockerController', dockerController);

    function dockerController($state, resolvedDomains) {
        var vm = this;
        vm.domains = resolvedDomains;
        if (vm.domains.length === 1 && $state.current.name == 'app.docker.domains'){
            $state.go('.domain', {domain:vm.domains[0].id});
        }
    }
})();
