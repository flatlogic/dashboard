(function () {
    'use strict';

    angular
        .module('qorDash.manage.accounts.account', [
            'ui.router'
        ])
        .config(appConfig);

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.manage.accounts.account', {
                url: '/:id',
                templateUrl: 'app/modules/manage/accounts/account/account.html',
                controller: 'AccountController',
                controllerAs: 'vm',
                authenticate: true,
                resolve: {
                    resolvedToken: function(manageLoader) {
                        return manageLoader.load();
                    },
                    resolvedAccount: function(accountsService, resolvedToken, $stateParams) {
                        return accountsService.getAccountById($stateParams.id, resolvedToken);
                    }
                }
            });
    }
})();
