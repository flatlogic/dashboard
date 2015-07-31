(function () {
    'use strict';

    var module = angular.module('qorDash.domains', [
        'ui.router',
        'ui.layout',
        'qorDash.widget',
        'qorDash.widget.domain_stat',
        'qorDash.widget.network',
        'qorDash.widget.domain_details',
        'qorDash.widget.container',
        'qorDash.domains.domain',
        'qorDash.domains.env',
        'qorDash.domains.env.network',
        'qorDash.domains.env.network.node',
        'qorDash.domains.env.network.note.logs',
        'qorDash.domains.env.resources',
        'log_details'

    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider', '$qorSidebarProvider'];

    function appConfig($stateProvider, $qorSidebarProvider) {
        $stateProvider
            .state('app.domains', {
                url: '/domains',
                views: {
                    'main@': {
                        templateUrl: 'app/modules/domains/domains.html',
                        controller: 'DomainsController'
                    }
                },
                authenticate: true
            });

        $qorSidebarProvider.config('domains', {
            title: 'Environments',
            nav: 40,
            content: '<span ui-sref="app.domains" qor-sidebar-group-heading="Domains" data-icon-class="fa fa-cloud"></span>',
            controller: 'DomainsSidebarController'
        });
    }
})();
