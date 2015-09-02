(function () {
    'use strict';

    var module = angular.module('qorDash.manage.settings', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.manage.settings', {
                url: '/settings',
                views: {
                    'main@': {
                        templateUrl: 'app/modules/manage/settings/settings.html'
                    }
                },
                authenticate: true
            });
    }
})();