(function () {
    'use strict';

    angular
        .module('qorDash.orchestrate.domain.instance', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.orchestrate.domain.instance', {
                url: '/:inst',
                templateUrl: 'app/modules/orchestrate/instance/instance.html',
                controller: 'OrchestrateInstanceController',
                resolve: {
                    resolvedInstances: function($stateParams, orchestrateService) {
                        return orchestrateService.getInstances($stateParams.id, $stateParams.inst);
                    }
                }
            })
    }
})();
