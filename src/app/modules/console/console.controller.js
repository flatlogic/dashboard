(function () {
    'use strict';

    angular
        .module('qorDash.console')
        .controller('ConsoleController', consoleController);

    function consoleController($state, resolvedDomains) {
        var vm = this;
        vm.domains = resolvedDomains;
        if (vm.domains.length === 1 && $state.current.name == 'app.console.domains'){
            $state.go('.domain', {domain:vm.domains[0].id});
        }
    }
})();
