(function () {
    'use strict';

    var module = angular.module('qorDash.configurations.services.state.files.files-view.diff', [
        'ui.router',
        'ui.codemirror',
        'ui-notification',
        'diff-match-patch'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations.services.state.files.files-view.diff', {
                url: '/diff/:diffToInstance/:diffToVersion',
                params: {
                    file: {},
                    instance: {},
                    version: {},
                    diffToInstance: { value: null, squash: true }, // optional param
                    diffToVersion: { value: null, squash: true }, // optional param
                    _preventAnimation: { value: null, squash: true }
                },
                templateUrl: 'app/modules/configurations/files-diff/files-diff.html',
                controller: 'FilesEditorController',
                authenticate: true
            })
    }
})();
