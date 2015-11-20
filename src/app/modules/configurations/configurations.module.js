(function () {
    'use strict';

    angular
        .module('qorDash.configurations', [
            'qorDash.core',
            'qorDash.configurations.services',
            'qorDash.configurations.services.state',
            'qorDash.configurations.services.state.files',
            'qorDash.configurations.services.state.files.files-view',
            'qorDash.configurations.services.state.files.files-view.diff',
            'qorDash.configurations.services.state.instances',
            'qorDash.configurations.services.state.instances.editor',
            'qorDash.configurations.services.state.packages',
            'qorDash.configurations.services.state.packages.editor'
        ])
        .config(config);

    function config($stateProvider, $qorSidebarProvider) {
        $stateProvider
            .state('app.configurations', {
                url: '/configurations',
                resolve: {
                    resolvedDomains: function(domainService) {
                        return domainService.loadDomains();
                    }
                },
                views: {
                    'main@': {
                        templateUrl: 'app/modules/configurations/configurations.html',
                        controller: 'ConfigurationsController'
                    }
                }
            });

        $qorSidebarProvider.config('configurations', {
            title: 'Config',
            nav: 5,
            content: '<span ui-sref="app.configurations" qor-sidebar-group-heading="Config" data-icon-class="fa fa-cogs"></span>'
        });
    }
})();
