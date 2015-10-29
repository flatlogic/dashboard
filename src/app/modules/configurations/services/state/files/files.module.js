(function () {
    'use strict';

    angular
        .module('qorDash.configurations.services.state.files', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.configurations.services.state.files', {
                url: '/files',
                templateUrl: 'app/modules/configurations/services/state/files/files.html',
                controller: 'FilesController',
                resolve: {
                    resolvedInstance: function($stateParams, configurationService) {
                        return configurationService.loadInstance($stateParams.domain);
                    }
                },
                authenticate: true
            })
    }
})();
