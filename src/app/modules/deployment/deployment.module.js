(function () {
    'use strict';

    var module = angular.module('qorDash.deployment', [
        'qorDash.widget',
        'qorDash.widget.terminal',
        'qorDash.widget.timeline'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.deployment', {
                url: '/deployment',
                templateUrl: 'app/modules/deployment/deployment.html',
                controller: 'DeploymentController'
            })
    }
})();
