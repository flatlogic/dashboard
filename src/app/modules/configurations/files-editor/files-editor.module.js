(function () {
    'use strict';

    var module = angular.module('qorDash.configurations.services.state.files.files-editor', [
        'ui.router',
        'ui.codemirror',
        'ui-notification',
        'diff-match-patch'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations.services.state.files.files-editor', {
                url: '/:file',
                templateUrl: 'app/modules/configurations/files-editor/files-editor.html',
                controller: 'FilesEditorController',
                authenticate: true
            })
    }
})();
