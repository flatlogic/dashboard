(function () {
    'use strict';

    var module = angular.module('qorDash.orchestrate.domain.instance.history.option', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.orchestrate.domain.instance.history.option', {
                url: '/:opt_id',
                templateUrl: 'app/modules/orchestrate/option/option.html',
                controller: 'OrchestrateOptionController',
                authenticate: true
            });
    }
})();
