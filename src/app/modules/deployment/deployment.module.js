(function () {
    'use strict';

    angular
        .module('qorDash.deployment', [
            'qorDash.widget',
            'qorDash.widget.terminal',
            'qorDash.widget.timeline'
        ])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.deployment', {
                url: '/deployment',
                templateUrl: 'app/modules/deployment/deployment.html',
                controller: 'DeploymentController'
            })
    }
})();
