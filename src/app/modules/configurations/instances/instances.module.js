(function () {
    'use strict';

    var module = angular.module('qorDash.configurations.state.services.instances', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations.state.services.instances', {
                url: '/:service',
                templateUrl: 'app/modules/configurations/instances/instances.html',
                controller: 'InstancesController',
                authenticate: true
            })
    }
})();
