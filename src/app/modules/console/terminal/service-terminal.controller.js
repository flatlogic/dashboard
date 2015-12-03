(function () {
    'use strict';

    angular
        .module('qorDash.console.domain.services.consoles.terminal')
        .controller('ServiceTerminalController', serviceTerminalController);

    function serviceTerminalController($stateParams, WS_URL) {
        var vm = this;
        vm.terminalId = $stateParams.terminalId;
        vm.service = $stateParams.service;
        vm.instance = $stateParams.instance;
        vm.domain = $stateParams.domain;
        vm.wsUrl = WS_URL + "/v1/console/" + vm.domain + "/" + vm.instance +
                    "/" + vm.service + "/" + vm.terminalId;
    }
})();
