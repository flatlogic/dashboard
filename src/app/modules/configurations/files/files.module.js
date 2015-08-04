(function () {
    'use strict';

    var module = angular.module('qorDash.configurations.services.editor.files', [
        'ui.router',
        'ui.codemirror'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations.services.editor.files', {
                url: '/files',
                templateUrl: 'app/modules/configurations/files/files.html',
                controller: 'FilesController',
                authenticate: true
            })
    }
})();
