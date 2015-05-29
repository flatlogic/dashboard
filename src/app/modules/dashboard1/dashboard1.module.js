(function() {
    'use strict';

    var module = angular.module('qorDash.dashboard1', [
        'ui.router',
        'ui.layout',
        'qorDash.widget',
        'qorDash.widget.timeline'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.dashboard1', {
                url: '/dashboard/1',
                templateUrl: 'app/modules/dashboard1/dashboard1.html',
                controller: 'Dashboard1Controller',
                authenticate: true
            })
    }
})();
