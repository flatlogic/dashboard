(function () {
    'use strict';

    angular
        .module('qorDash.domains.env.network', [
            'ui.layout',
            'qorDash.api'
        ])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.domains.domain.env.network', {
                url: '/network',
                controller: 'DomainsNetworkController',
                controllerAs: 'vm',
                templateUrl: 'app/modules/domains/network/network.html',
                resolve: {
                    resolvedNetworkData: function(networkViewService) {
                        return networkViewService.load();
                    }
                }
            })
    }
})();
