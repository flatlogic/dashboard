(function () {
    'use strict';

    var module = angular.module('qorDash.manage.accounts.account', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.manage.accounts.account', {
                url: '/:id',
                templateUrl: 'app/modules/manage/accounts/account/account.html',
                controller: 'AccountController',
                controllerAs: 'vm',
                authenticate: true
            });
    }
})();
