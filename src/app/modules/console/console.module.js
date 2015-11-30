(function () {
    'use strict';

    angular
        .module('qorDash.console', [
            'qorDash.console',
            'qorDash.console.domain',
            'qorDash.console.domain.consoles'
        ])
        .config(config);

    function config($stateProvider, $qorSidebarProvider) {

        $stateProvider
            .state('app.console', {
                url: '/console',
                views: {
                    'main@': {
                        template: '<div ui-view=""></div>',
                        controller: function ($state) {
                            var currentState = $state.current.name;
                            var stateTo = currentState === 'app.console' ? 'app.console.domains' : currentState;
                            $state.go(stateTo);
                        }
                    }
                }
            })
            .state('app.console.domains', {
                url: '',
                templateUrl: 'app/modules/console/console.html',
                controller: 'ConsoleController',
                controllerAs: 'vm',
                resolve: {
                    resolvedDomains: function (domainService) {
                        return domainService.loadDomains();
                    }
                }
            });

        $qorSidebarProvider.config('console', {
            title: 'Console',
            nav: 8,
            content: '<span ui-sref="app.console" qor-sidebar-group-heading="Console" data-icon-class="fa fa-terminal"></span>'
        });
    }

})();
