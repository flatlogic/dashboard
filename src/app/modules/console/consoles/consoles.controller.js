(function () {
    'use strict';

    angular
        .module('qorDash.console.domain.services.consoles')
        .controller('ConsolesController', consolesController);

    function consolesController($stateParams, resolvedServices) {
        var vm = this;
        vm.service = $stateParams.service;
        vm.consoles = resolvedServices[vm.service];
    }
})();
