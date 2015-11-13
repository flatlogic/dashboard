(function () {
    'use strict';

    angular
        .module('qorDash.core', [
            'ngAnimate',
            'ngSanitize'
        ])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
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
