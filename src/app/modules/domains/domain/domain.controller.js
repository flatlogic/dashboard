(function () {
    'use strict';

    angular
        .module('qorDash.domains')
        .controller('DomainController', domainController);

    function domainController(resolvedDomain) {
        var vm = this;
        vm.domain = resolvedDomain;
    }
})();
