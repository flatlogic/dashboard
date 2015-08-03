(function () {
    'use strict';

    var module = angular.module('log_details', [
        'ui.router',
        'ui.layout'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider.state('log_details', {
            url: '/log-details',
            templateUrl: 'app/modules/domains/node-logs/log-details.html',
            authenticate: false
        });
    }
})();
