(function () {
    'use strict';

    var module = angular.module('qorDash.configurations.services.state.instances.editor', [
        'ui-notification',
        'ui.bootstrap',
        'mwl.confirm'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations.services.state.instances.editor', {
                url: '/:instances',
                templateUrl: 'app/modules/configurations/services/state/instances/editor/editor.html',
                controller: 'EditorController'
            })
    }
})();
