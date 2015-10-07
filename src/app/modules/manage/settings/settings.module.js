(function () {
    'use strict';

    var module = angular.module('qorDash.manage.settings', [
        'ui.router',
        'qorDash.manage.settings.authentication'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.manage.settings', {
                url: '/settings',
                templateUrl: 'app/modules/manage/settings/settings.html',
                controller: 'SettingsController',
                authenticate: true
            });
    }
})();
