(function () {
    'use strict';

    angular
        .module('qorDash.domains.env.network', [
            'ui.router',
            'ui.layout',
            'qorDash.loaders'
        ])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.domains.domain.env.network', {
                url: '/network',
                controller: 'DomainsNetworkController',
                controllerAs: 'vm',
                templateUrl: 'app/modules/domains/network/network.html',
                authenticate: true
            })
    }
})();
