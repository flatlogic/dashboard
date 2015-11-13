(function () {
    'use strict';

    var module = angular.module('qorDash.orchestrate.domain.instance.history', []);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.orchestrate.domain.instance.history', {
                url: '/:opt',
                templateUrl: 'app/modules/orchestrate/history/history.html',
                controller: 'OrchestrateHistoryController'
            })
    }
})();
