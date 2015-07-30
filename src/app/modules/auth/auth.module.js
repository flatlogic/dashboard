(function () {
    'use strict';

    var module = angular.module('qorDash.auth', [
        'qorDash.core',
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider', '$httpProvider', '$qorSidebarProvider'];

    function appConfig($stateProvider, $httpProvider, $qorSidebarProvider) {
        $httpProvider.interceptors.push('authInterceptor');
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/modules/auth/login.html',
                controller: 'LoginController'
            })
            .state('logout', {
                url: '/logout',
                controller: function ($location, user) {
                    user.logout();
                    $location.path('/login');
                }
            });

        $qorSidebarProvider.config('User', {
            title: 'User',
            nav: 20,
            content: '<span id="user-actions" user-section  qor-sidebar-group-heading="Admin" data-icon-class="fa fa-user"></span>'
        });
    }
})();
