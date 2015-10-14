(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain')
        .controller('DockerDomainController', domainController);

    function domainController(resolvedDomain) {
        var vm = this;
        vm.domain = resolvedDomain;
    }
})();
