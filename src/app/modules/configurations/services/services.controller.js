(function () {
    'use strict';

    angular
        .module('qorDash.configurations.services')
        .controller('ServicesController', servicesController);

    function servicesController($scope, $state, resolvedDomain) {
        var vm = this;
        vm.services = resolvedDomain.services;
        if (vm.services.length == 1 && $state.current.name == 'app.configurations.services'){
            $state.go('.state', {service: vm.services[0]})
        }
    }

})();
