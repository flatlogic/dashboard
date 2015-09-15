(function () {
    'use strict';

    var module = angular.module('qorDash.configurations.services.state.packages', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations.services.state.packages', {
                url: '/packages',
                templateUrl: 'app/modules/configurations/services/state/packages/packages.html',
                controller: 'PackagesController'
            })
    }
})();
