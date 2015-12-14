(function () {
    'use strict';

    angular
        .module('qorDash.console.domain.services.consoles', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.console.domains.domain.services.consoles', {
                url: '/:service',
                templateUrl: 'app/modules/console/consoles/consoles.html',
                controller: 'ConsolesController',
                controllerAs: 'vm',
                resolve: {
                    resolvedServices: function(domainService, $stateParams) {
                        return domainService.loadServices($stateParams.domain, $stateParams.instance);
                    }
                }
            })
    }
})();
