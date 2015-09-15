(function () {
    'use strict';

    var module = angular.module('qorDash.configurations.services.state.packages.editor', [
        'ui.router',
        'ui-notification',
        'ui.bootstrap',
        'mwl.confirm'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations.services.state.packages.editor', {
                url: '/:instances',
                templateUrl: 'app/modules/configurations/services/state/packages/editor/editor.html',
                controller: 'PackagesEditorController'
            })
    }
})();
