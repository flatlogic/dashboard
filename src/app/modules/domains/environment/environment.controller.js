(function () {
    'use strict';

    angular
        .module('qorDash.domains')
        .controller('DomainEnvironmentController', domainEnvironmentController);

    function domainEnvironmentController($stateParams, WS_URL) {
        var vm = this;

        vm.environment = {};
        vm.environment.name = $stateParams.env;

        vm.eventsWsUrl = WS_URL + '/v1/events';
    }
})();
