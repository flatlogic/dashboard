(function() {
    'use strict';

    var module = angular.module('qorDash.configurations', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations', {
                url: '/configurations',
                templateUrl: 'app/modules/configurations/configurations.html',
                controller: 'ConfigurationsController',
                authenticate: true
            })
    }
})();
