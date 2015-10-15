(function () {
    'use strict';

    var module = angular.module('qorDash.orchestrate.domain', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.orchestrate.domain', {
                url: '/:id',
                templateUrl: 'app/modules/orchestrate/domain/domain.html',
                controller: 'OrchestrateDomainController',
                controllerAs: 'vm',
                authenticate: true
            })
    }
})();
