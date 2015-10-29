(function () {
    'use strict';

    angular
        .module('qorDash.orchestrate.domain', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.orchestrate.domain', {
                url: '/:id',
                templateUrl: 'app/modules/orchestrate/domain/domain.html',
                controller: 'OrchestrateDomainController',
                controllerAs: 'vm',
                resolve: {
                    resolvedDomain: function(domainService, $stateParams) {
                        return domainService.loadDomain($stateParams.id);
                    }
                },
                authenticate: true
            })
    }
})();
