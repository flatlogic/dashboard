(function () {
    'use strict';

    angular
        .module('qorDash', [
            'ui.router',
            'chart.js',
            'qorDash.constants',
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
        .config(function($httpProvider){
            $httpProvider.defaults.headers.post['Content-Type'] =  'application/json';
        });

    angular.element(document).ready(function() {
        angular.bootstrap(document, ["qorDash"]);
    });
    
})();
