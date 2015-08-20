(function () {
    'use strict';

    var module = angular.module('qorDash.configurations.state.files', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations.state.files', {
                url: '/files',
                templateUrl: 'app/modules/configurations/files/files.html',
                controller: 'FilesController',
                authenticate: true
            })
    }
})();
