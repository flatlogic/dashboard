(function () {
    'use strict';

    var module = angular.module('qorDash.domains', [
        'ui.router',
        'ui.layout',
        'qorDash.widget',
        'qorDash.widget.domain_stat',
        'qorDash.widget.network',
        'qorDash.widget.domain_details',
        'qorDash.widget.container'

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
            })
            .state('app.domains.domain', {
                url: '/:id',
                templateUrl: 'app/modules/domains/domain/domain.html',
                controller: 'DomainController',
                authenticate: true
            })
            .state('app.domains.domain.env', {
                url: '/:env',
                templateUrl: 'app/modules/domains/environment/environment.html',
                controller: 'DomainEnvironmentController',
                authenticate: true
            })
            .state('app.domains.domain.env.network', {
                url: '/network',
                templateUrl: 'app/modules/domains/network/network.html',
                authenticate: true
            })
            .state('app.domains.domain.env.network.node', {
                url: '/:depth/:node',
                templateUrl: 'app/modules/domains/node/node.html',
                controller: 'DomainNodeController',
                authenticate: true
            })
            .state('app.domains.domain.env.network.node.logs', {
                url: '/logs',
                templateUrl: 'app/modules/domains/node-logs/node-logs.html',
                authenticate: true
            })
            .state('app.domains.domain.env.resources', {
                url: '/resources',
                templateUrl: 'app/modules/domains/resources/resources.html',
                authenticate: true
            });

        $stateProvider.state('log_details', {
            url: '/log-details',
            templateUrl: 'app/modules/domains/node-logs/log-details.html',
            authenticate: false
        });

        $qorSidebarProvider.config('domains', {
            title: 'Environments',
            nav: 40,
            content: '<span ui-sref="app.domains" qor-sidebar-group-heading="Domains" data-icon-class="fa fa-cloud"></span>',
            controller: 'DomainsSidebarController'
        });
    }
})();
