(function () {
    'use strict';

    angular
      .module('qorDash.auth', [
        'qorDash.core',
        'ui.router',
        'ngMessages'
      ])
      .config(appConfig)
      .run(runAuth);

    function appConfig($stateProvider, $httpProvider, $qorSidebarProvider) {
        $httpProvider.interceptors.push('authInterceptor');
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/modules/auth/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .state('logout', {
                url: '/logout',
                controller: function ($state, user) {
                    user.logout();
                    $state.go('login');
                }
            });

        $qorSidebarProvider.config('User', {
            title: 'User',
            nav: 20,
            content: '<span id="user-actions" ui-sref="logout" qor-sidebar-group-heading="Logout" data-icon-class="fa fa-sign-out"></span>'
        });
    }

    function runAuth($rootScope, $state, user) {
        $rootScope.$on("$stateChangeStart", function (event, toState) {
            // Go to login page if user is not authorized
            if (toState.authenticate && !user.isAuthed()) {
                $state.transitionTo("login");
                event.preventDefault();
                return;
            }
            // Go to 404 if user has no access to page controller
            if (toState.authenticate && toState.controller && !user.hasAccessTo(toState.controller)) {
                $state.transitionTo('error');
                event.preventDefault();
            }
        });
    }
})();
