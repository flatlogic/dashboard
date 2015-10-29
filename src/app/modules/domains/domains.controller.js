(function () {
    'use strict';

    var domainsController = angular.createAuthorizedController('DomainsController', ['$state', 'resolvedDomains',
        function ($state, resolvedDomains) {
            var vm = this;
            vm.domains = resolvedDomains;
            if(vm.domains.length === 1 && $state.current.name == 'app.domains'){
                $state.go('.domain', {domain:vm.domains[0].id});
            }
    }]);

    angular
        .module('qorDash.domains')
        .controller(domainsController);
})();
