(function () {
    'use strict';

    var module = angular.module('qorDash.manage', [
        'ui.router',
        'qorDash.manage.accounts',
        'qorDash.manage.settings',
        'qorDash.manage.accounts.account'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider', '$qorSidebarProvider'];

    function appConfig($stateProvider, $qorSidebarProvider) {
        $stateProvider
            .state('app.manage', {
                url: '/manage',
                views: {
                    'main@': {
                        templateUrl: 'app/modules/manage/manage.html'
                    }
                },
                authenticate: true
            });

        $qorSidebarProvider.config('manage', {
            title: 'Manage',
            nav: 7,
            content: '<span ui-sref="app.manage" qor-sidebar-group-heading="Manage" data-icon-class="fa fa-edit"></span>'
        });
    }
})();
