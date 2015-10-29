(function () {
    'use strict';

    angular
        .module('qorDash.configurations.services', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.configurations.services', {
                url: '/:domain',
                templateUrl: 'app/modules/configurations/services/services.html',
                controller: 'ServicesController',
                controllerAs: 'vm',
                resolve: {
                    resolvedDomain: function(domainService, $stateParams) {
                        return domainService.loadDomain($stateParams.domain);
                    }
                },
                authenticate: true
            })
    }
})();
