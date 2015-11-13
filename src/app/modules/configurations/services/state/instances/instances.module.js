(function () {
    'use strict';

    angular
        .module('qorDash.configurations.services.state.instances', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.configurations.services.state.instances', {
                url: '/instances',
                templateUrl: 'app/modules/configurations/services/state/instances/instances.html',
                controller: 'InstancesController',
                resolve: {
                    resolvedEnv: function($stateParams, configurationService) {
                        return configurationService.loadEnv($stateParams.domain);
                    }
                }
            })
    }
})();
