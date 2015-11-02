(function () {
    'use strict';

    var module = angular.module('qorDash.domains.env.network', [
        'ui.router',
        'ui.layout',
        'qorDash.loaders'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
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
