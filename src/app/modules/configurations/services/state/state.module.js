(function () {
    'use strict';

    angular
        .module('qorDash.configurations.services.state', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.configurations.services.state', {
                url: '/:service',
                templateUrl: 'app/modules/configurations/services/state/state.html'
            })
    }
})();
