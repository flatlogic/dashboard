(function () {
    'use strict';

    angular
        .module('qorDash.domains', [
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
        ])
        .config(config);

    function config($stateProvider, $qorSidebarProvider) {
        $stateProvider
            .state('app.domains', {
                url: '/domains',
                resolve: {
                    resolvedDomains: function(domainService) {
                        return domainService.loadDomains();
                    }
                },
                views: {
                    'main@': {
                        templateUrl: 'app/modules/domains/domains.html',
                        controller: 'DomainsController',
                        controllerAs: 'vm'
                    }
                }
            });

        $qorSidebarProvider.config('domains', {
            title: 'Environments',
            nav: 2,
            content: '<span ui-sref="app.domains" qor-sidebar-group-heading="Domains" data-icon-class="fa fa-cloud"></span>'
        });
    }
})();
