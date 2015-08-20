(function () {
    'use strict';

    var module = angular.module('qorDash.configurations.state', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations.state', {
                url: '/:domain',
                templateUrl: 'app/modules/configurations/state/state.html'
            })
    }
})();
