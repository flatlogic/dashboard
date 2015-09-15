(function () {
    'use strict';

    var module = angular.module('qorDash.dashboard', [
        'ui.router',
        'ui.layout',
        'qorDash.widget',
        'qorDash.widget.terminal',
        'qorDash.widget.timeline',
        'qorDash.widget.events'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider', '$qorSidebarProvider'];

    function appConfig($stateProvider, $qorSidebarProvider) {
        $stateProvider
            .state('app.dashboard', {
                url: '/dashboard',
                views: {
                    'main@': {
                        templateUrl: 'app/modules/dashboard/dashboard.html',
                        controller: 'DashboardController'
                    }
                },
                authenticate: true
            });

        $qorSidebarProvider.config('dashboard', {
            title: 'Dashboard',
            nav: 1,
            content: '<span ui-sref="app.dashboard" qor-sidebar-group-heading="Events" data-icon-class="fa fa-newspaper-o"></span>'
        });
    }
})();
