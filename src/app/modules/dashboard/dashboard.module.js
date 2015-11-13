(function () {
    'use strict';

    angular
        .module('qorDash.dashboard', [
            'qorDash.widget',
            'qorDash.widget.terminal',
            'qorDash.widget.timeline',
            'qorDash.widget.events'
        ])
        .config(config);

    function config($stateProvider, $qorSidebarProvider) {
        $stateProvider
            .state('app.dashboard', {
                url: '/dashboard',
                views: {
                    'main@': {
                        templateUrl: 'app/modules/dashboard/dashboard.html',
                        controller: 'DashboardController'
                    }
                }
            });

        $qorSidebarProvider.config('dashboard', {
            title: 'Dashboard',
            nav: 1,
            content: '<span ui-sref="app.dashboard" qor-sidebar-group-heading="Events" data-icon-class="fa fa-newspaper-o"></span>'
        });
    }
})();
