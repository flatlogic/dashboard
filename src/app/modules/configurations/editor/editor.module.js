(function () {
    'use strict';

    var module = angular.module('qorDash.configurations.services.editor', [
        'ui.router',
        'ui-notification',
        'ui.bootstrap'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations.services.instances.editor', {
                url: '/:instances',
                templateUrl: 'app/modules/configurations/editor/editor.html',
                controller: 'EditorController',
                authenticate: true
            })
    }
})();
