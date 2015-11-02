(function () {
    'use strict';

    var module = angular.module('qorDash.domains.env.network.note.logs', [
        'ui.router',
        'ui.layout'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.domains.domain.env.network.node.logs', {
                url: '/logs',
                templateUrl: 'app/modules/domains/node-logs/node-logs.html'
            })
    }
})();
