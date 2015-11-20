(function () {
    'use strict';

    angular
        .module('qorDash', [
            'ui.router',
            'ui.layout',
            'chart.js',

            'ngMessages',
            'ngAnimate',
            'ngSanitize',

            'qorDash.config',
            'qorDash.api',
            'qorDash.core',
            'qorDash.auth',
            'qorDash.dashboard',
            'qorDash.domains',
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
