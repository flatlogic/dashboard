(function () {
    'use strict';

    var module = angular.module('qorDash.configurations.services', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations.services', {
                url: '/:domain',
                templateUrl: 'app/modules/configurations/services/services.html',
                controller: 'ServicesController',
                authenticate: true
            })
    }
})();
