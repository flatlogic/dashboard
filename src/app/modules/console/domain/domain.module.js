(function () {
    'use strict';

    angular
        .module('qorDash.console.domain', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.console.domains.domain', {
                url: '/:domain',
                templateUrl: 'app/modules/console/domain/domain.html',
                controller: 'ConsoleDomainController',
                controllerAs: 'vm',
                resolve: {
                    resolvedDomain: function(domainService, $stateParams) {
                        return domainService.loadDomain($stateParams.domain);
                    }
                }
            })
    }
})();
