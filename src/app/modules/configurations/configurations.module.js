(function () {
    'use strict';

    var module = angular.module('qorDash.configurations', [
        'ui.router',
        'ui.codemirror'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider', '$qorSidebarProvider'];

    function appConfig($stateProvider, $qorSidebarProvider) {
        $stateProvider
            .state('app.configurations', {
                url: '/configurations',
                views: {
                    'main@': {
                        templateUrl: 'app/modules/configurations/configurations.html',
                        controller: 'ConfigurationsController'
                    }
                },
                authenticate: true
            })
            .state('app.configurations.services', {
                url: '/:domain',
                templateUrl: 'app/modules/configurations/services/services.html',
                controller: 'ServicesController',
                authenticate: true
            })
            .state('app.configurations.services.editor', {
                url: '/:service',
                templateUrl: 'app/modules/configurations/editor/editor.html',
                controller: 'EditorController',
                authenticate: true
            })
            .state('app.configurations.services.editor.files', {
                url: '/files',
                templateUrl: 'app/modules/configurations/files/files.html',
                controller: 'FilesController',
                authenticate: true
            });

        $qorSidebarProvider.config('configurations', {
            title: 'Config',
            nav: 30,
            content: '<span ui-sref="app.configurations" qor-sidebar-group-heading="Config" data-icon-class="fa fa-cogs"></span>'
        });
    }
})();
