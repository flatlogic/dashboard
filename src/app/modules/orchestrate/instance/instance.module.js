(function () {
    'use strict';

    var module = angular.module('qorDash.orchestrate.domain.instance', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.orchestrate.domain.instance', {
                url: '/:inst',
                templateUrl: 'app/modules/orchestrate/instance/instance.html',
                controller: 'OrchestrateInstanceController',
                controllerAs: 'vm',
                authenticate: true
            })
    }
})();
