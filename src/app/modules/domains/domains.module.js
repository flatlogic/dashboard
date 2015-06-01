(function() {
    'use strict';

    var module = angular.module('qorDash.domains', [
        'ui.router',
        'ui.layout',
        'qorDash.widget'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.domains', {
                url: '/domains/:domainId',
                templateUrl: 'app/modules/domains/domains.html',
                controller: 'DomainsController',
                authenticate: true
            })
    }
})();
