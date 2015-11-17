(function () {
    'use strict';

    angular
        .module('qorDash.orchestrate.domain.instance.history', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.orchestrate.domain.instance.history', {
                url: '/:opt',
                templateUrl: 'app/modules/orchestrate/history/history.html',
                controller: 'OrchestrateHistoryController',
                resolve: {
                    resolvedHistory: function($stateParams, orchestrateService) {
                        return orchestrateService.loadHistory($stateParams.id, $stateParams.inst, $stateParams.opt);
                    }
                }
            })
    }
})();
