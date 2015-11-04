(function () {
    'use strict';

    var module = angular.module('qorDash.configurations.services.state.files.files-view', [
        'ui.codemirror',
        'ui-notification',
        'diff-match-patch'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.configurations.services.state.files.files-view', {
                url: '/:file/:instance/:version',
                params: {
                    file: {},
                    instance: { value: null, squash: true }, // optional param
                    version: { value: null, squash: true } // optional param
                },
                templateUrl: 'app/modules/configurations/services/state/files/files-view/files-view.html',
                controller: 'FilesViewController'
            })
    }
})();
