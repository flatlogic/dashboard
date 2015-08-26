(function () {
    'use strict';

    var module = angular.module('qorDash.configurations.services.state.instances', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations.services.state.instances', {
                url: '/instances',
                templateUrl: 'app/modules/configurations/instances/instances.html',
                controller: 'InstancesController',
                authenticate: true
            })
    }
})();
