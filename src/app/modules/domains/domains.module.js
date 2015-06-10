(function() {
    'use strict';

    var module = angular.module('qorDash.domains', [
        'ui.router',
        'ui.layout',
        'qorDash.widget',
        'qorDash.widget.domain_stat',
        'qorDash.widget.network',
        'qorDash.widget.domain_details'

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
