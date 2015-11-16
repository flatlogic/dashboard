(function () {
    'use strict';

    angular
        .module('qorDash.manage.settings', [
            'qorDash.manage.settings.authentication'
        ])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.manage.settings', {
                url: '/settings',
                templateUrl: 'app/modules/manage/settings/settings.html'
            });
    }
})();
