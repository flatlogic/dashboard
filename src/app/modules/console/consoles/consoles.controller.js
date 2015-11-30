(function () {
    'use strict';

    angular
        .module('qorDash.console')
        .controller('ConsolesController', consolesController);

    function consolesController($stateParams, resolvedConsoles) {
        var vm = this;
        vm.instance = $stateParams.instance;
        vm.consoles = resolvedConsoles;
    }

})();
