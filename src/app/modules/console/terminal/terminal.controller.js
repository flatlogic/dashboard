(function () {
    'use strict';

    angular
        .module('qorDash.console.domain.services.consoles.terminal')
        .controller('TerminalController', terminalController);

    function terminalController($stateParams) {
        var vm = this;
        vm.terminalId = $stateParams.terminalId;
    }
})();
