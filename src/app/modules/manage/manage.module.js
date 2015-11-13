(function () {
    'use strict';

    angular
        .module('qorDash.manage', [
            'qorDash.manage.accounts',
            'qorDash.manage.settings',
            'qorDash.manage.accounts.account'
        ])
        .config(config);

    function config($stateProvider, $qorSidebarProvider) {
        $stateProvider
            .state('app.manage', {
                url: '/manage',
                views: {
                    'main@': {
                        templateUrl: 'app/modules/manage/manage.html'
                    }
                }
            });

        $qorSidebarProvider.config('manage', {
            title: 'Manage',
            nav: 7,
            content: '<span ui-sref="app.manage" qor-sidebar-group-heading="Manage" data-icon-class="fa fa-edit"></span>'
        });
    }
})();
