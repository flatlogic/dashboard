(function () {
    'use strict';

    angular
        .module('qorDash.domains.env.network', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.domains.domain.env.network', {
                url: '/network',
                templateUrl: 'app/modules/domains/network/network.html',
                authenticate: true
            })
    }
})();
