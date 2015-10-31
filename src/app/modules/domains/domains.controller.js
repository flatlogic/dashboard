(function () {
    'use strict';

    angular
        .module('qorDash.domains')
        .controller('DomainsController', domainsController);

    function domainsController($state, resolvedDomains) {
        var vm = this;
        vm.domains = resolvedDomains;
        if(vm.domains.length === 1 && $state.current.name == 'app.domains'){
            $state.go('.domain', {domain:vm.domains[0].id});
        }
    }
})();
