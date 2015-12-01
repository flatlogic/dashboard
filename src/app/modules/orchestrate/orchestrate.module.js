(function () {
    'use strict';

    angular
        .module('qorDash.orchestrate', [
            'qorDash.orchestrate.domain',
            'qorDash.orchestrate.domain.instance',
            'qorDash.orchestrate.domain.instance.history',
            'qorDash.orchestrate.domain.instance.history.option'
        ])
        .config(config);

    function config($stateProvider, $qorSidebarProvider) {
        $stateProvider
            .state('app.orchestrate', {
                url: '/orchestrate',
                resolve: {
                    resolvedDomains: function(domainService) {
                        return domainService.loadDomains();
                    }
                },
                views: {
                    'main@': {
                        templateUrl: 'app/modules/orchestrate/orchestrate.html',
                        controller: 'OrchestrateController'
                    }
                }
            });

        $qorSidebarProvider.config('orchestrate', {
            title: 'Config',
            nav: 6,
            content: '<span ui-sref="app.orchestrate" ui-sref-opts="{reload: true}" qor-sidebar-group-heading="Orchestrate" data-icon-class="fa fa-building"></span>'
        });
    }
})();
