(function () {
    'use strict';

    var module = angular.module('qorDash.domains.env', [
        'ui.router',
        'ui.layout'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.domains.domain.env', {
                url: '/:env',
                templateUrl: 'app/modules/domains/environment/environment.html',
                controller: 'DomainEnvironmentController',
                authenticate: true
            })
    }
})();
