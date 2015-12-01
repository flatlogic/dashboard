(function () {
    'use strict';

    angular
        .module('qorDash.console.domain.services', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.console.domains.domain.services', {
                url: '/:instance',
                templateUrl: 'app/modules/console/services/services.html',
                controller: 'ServicesController',
                controllerAs: 'vm',
                resolve: {
                    resolvedServices: function(domainService, $stateParams) {
                        return domainService.loadServices($stateParams.domain, $stateParams.instance);
                    }
                }
            })
    }
})();
