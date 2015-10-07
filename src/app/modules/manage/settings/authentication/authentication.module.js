(function () {
    'use strict';

    var module = angular.module('qorDash.manage.settings.authentication', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.manage.settings.authentication', {
                url: '/authentication',
                templateUrl: 'app/modules/manage/settings/authentication/authentication.html',
                controller: 'AuthenticationSettingsController'
            });
    }
})();
