(function () {
    'use strict';

    angular
        .module('qorDash.orchestrate')
        .controller('OrchestrateDomainController', orchestrateDomainController);

    function orchestrateDomainController($scope, resolvedDomain) {
        var vm = this;
        vm.domain = resolvedDomain;
    }

})();
