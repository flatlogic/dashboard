(function () {
    'use strict';

    var module = angular.module('qorDash.configurations.services.state', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations.services.state', {
                url: '/:service',
                templateUrl: 'app/modules/configurations/state/state.html'
            })
    }
})();
