(function () {
    'use strict';

    var module = angular.module('qorDash.configurations.state.services', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations.state.services', {
                url: '/variables',
                templateUrl: 'app/modules/configurations/services/services.html',
                controller: 'ServicesController',
                authenticate: true
            })
    }
})();
