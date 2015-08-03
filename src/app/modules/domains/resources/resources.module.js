(function () {
    'use strict';

    var module = angular.module('qorDash.domains.env.resources', [
        'ui.router',
        'ui.layout'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.domains.domain.env.resources', {
                url: '/resources',
                templateUrl: 'app/modules/domains/resources/resources.html',
                authenticate: true
            });
    }
})();
