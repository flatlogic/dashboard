(function () {
    'use strict';

    angular
        .module('qorDash.console')
        .controller('ServicesController', servicesController);

    function servicesController($stateParams, resolvedServices) {
        var vm = this;
        vm.instance = $stateParams.instance;
        vm.services = resolvedServices;
    }

})();
