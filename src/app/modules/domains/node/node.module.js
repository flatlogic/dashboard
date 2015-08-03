(function () {
    'use strict';

    var module = angular.module('qorDash.domains.env.network.node', [
        'ui.router',
        'ui.layout'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.domains.domain.env.network.node', {
                url: '/:depth/:node',
                templateUrl: 'app/modules/domains/node/node.html',
                controller: 'DomainNodeController',
                authenticate: true
            })
    }
})();
