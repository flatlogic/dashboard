(function () {
    'use strict';

    angular
        .module('qorDash.orchestrate.domain.instance.history.option', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.orchestrate.domain.instance.history.option', {
                url: '/:opt_id',
                templateUrl: 'app/modules/orchestrate/option/option.html',
                controller: 'OrchestrateOptionController'
            });
    }
})();
