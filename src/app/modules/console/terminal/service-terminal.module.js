(function () {
    'use strict';

    angular
        .module('qorDash.console.domain.services.consoles.terminal', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.console.domains.domain.services.consoles.terminal', {
                url: '/:terminalId',
                templateUrl: 'app/modules/console/terminal/service-terminal.html',
                controller: 'ServiceTerminalController',
                controllerAs: 'vm'
            })
    }
})();
