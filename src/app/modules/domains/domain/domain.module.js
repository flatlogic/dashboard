(function () {
    'use strict';

    var module = angular.module('qorDash.domains.domain', [
        'ui.router',
        'ui.layout'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.domains.domain', {
                url: '/:id',
                templateUrl: 'app/modules/domains/domain/domain.html',
                controller: 'DomainController',
                authenticate: true
            })
    }
})();
