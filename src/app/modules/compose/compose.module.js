(function() {
    'use strict';

    var module = angular.module('qorDash.compose', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.compose', {
                url: '/compose',
                templateUrl: 'app/modules/compose/compose.html',
                controller: 'ComposeController',
                authenticate: true
            })
    }
})();
