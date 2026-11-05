(function () {
    'use strict';

    angular
        .module('qorDash.core', [
            'qorDash.config'
        ])
        .config(config);

    function config($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'app/modules/core/app.html'
            });

        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            $state.go('app.dashboard');
        });
    }

})();
