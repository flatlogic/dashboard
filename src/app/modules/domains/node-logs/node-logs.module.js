(function () {
    'use strict';

    angular
        .module('qorDash.domains.env.network.note.logs', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.domains.domain.env.network.node.logs', {
                url: '/logs',
                templateUrl: 'app/modules/domains/node-logs/node-logs.html'
            })
    }
})();
