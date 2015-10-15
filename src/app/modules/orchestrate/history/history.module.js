(function () {
    'use strict';

    var module = angular.module('qorDash.orchestrate.domain.instance.history', [
        'ui.router'
    ]);

    module.config(appConfig);

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.orchestrate.domain.instance.history', {
                url: '/:opt',
                templateUrl: 'app/modules/orchestrate/history/history.html',
                controller: 'OrchestrateHistoryController',
                controllerAs: 'vm',
                authenticate: true
            })
    }
})();
