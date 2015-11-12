(function () {
    'use strict';

    angular
        .module('qorDash', [
            'ui.router',
            'chart.js',
            'ngMessages',
            'qorDash.config',
            'qorDash.loaders',
            'qorDash.core',
            'qorDash.auth',
            'qorDash.dashboard',
            'qorDash.domains',
            'qorDash.deployment',
            'qorDash.compose',
            'qorDash.configurations',
            'qorDash.orchestrate',
            'qorDash.manage',
            'qorDash.docker'
        ])
        .config(config)
        .run(run);

    function config($httpProvider, $stateProvider){
        $httpProvider.defaults.headers.post['Content-Type'] =  'application/json';
    }

    function run($rootScope, errorHandler){
        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
            errorHandler.showError(error);
        });
    }

    angular.element(document).ready(function() {
        angular.bootstrap(document, ["qorDash"]);
    });

})();
