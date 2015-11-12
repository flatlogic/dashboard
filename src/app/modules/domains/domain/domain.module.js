(function () {
    'use strict';

    angular
        .module('qorDash.domains.domain', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.domains.domain', {
                url: '/:domain',
                templateUrl: 'app/modules/domains/domain/domain.html',
                controller: 'DomainController',
                controllerAs: 'vm',
                resolve: {
                    resolvedDomain: function(domainService, $stateParams) {
                        return domainService.loadDomain($stateParams.domain);
                    }
                }
            })
    }
})();
