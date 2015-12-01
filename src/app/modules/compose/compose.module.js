(function () {
    'use strict';

    angular
        .module('qorDash.compose', [])
        .config(config);

    function config($stateProvider, $qorSidebarProvider) {
        $stateProvider
            .state('app.compose', {
                url: '/compose',
                views: {
                    'main@': {
                        templateUrl: 'app/modules/compose/compose.html',
                        controller: 'ComposeController'
                    }
                }
            })
            .state('app.compose.sub', {
                url: '/sub',
                templateUrl: 'app/modules/compose/compose-sub.html'
            })

            .state('app.compose.sub.sub', {
                url: '/sub',
                templateUrl: 'app/modules/compose/compose-sub-sub.html'
            })

            .state('app.compose.sub.sub.sub', {
                url: '/sub',
                templateUrl: 'app/modules/compose/compose-sub-sub-sub.html'
            })

            .state('app.compose.sub.sub.sub.sub', {
                url: '/sub',
                templateUrl: 'app/modules/compose/compose-sub-sub-sub-sub.html'
            });

        $qorSidebarProvider.config('compose', {
            title: 'Compose',
            nav: 4,
            content: '<span ui-sref="app.compose" ui-sref-opts="{reload: true}" qor-sidebar-group-heading="compose" data-icon-class="fa fa-envelope"></span>'
        });
    }
})();
