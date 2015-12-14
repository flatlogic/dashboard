(function () {
    'use strict';

    angular
        .module('qorDash.console.domain')
        .controller('ConsoleDomainController', domainController);

    function domainController(resolvedDomain) {
        var vm = this;
        vm.domain = resolvedDomain;
    }
})();
