(function () {
    'use strict';

    angular
        .module('qorDash.console.domain.consoles', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.console.domains.domain.consoles', {
                url: '/:instance',
                templateUrl: 'app/modules/console/consoles/consoles.html',
                controller: 'ConsolesController',
                controllerAs: 'vm',
                resolve: {
                    resolvedConsoles: function(domainService, $stateParams) {
                        return domainService.loadConsoles($stateParams.domain, $stateParams.instance);
                    }
                }
            })
    }
})();
