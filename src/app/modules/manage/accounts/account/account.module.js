(function () {
    'use strict';

    angular
        .module('qorDash.manage.accounts.account', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.manage.accounts.account', {
                url: '/:id',
                templateUrl: 'app/modules/manage/accounts/account/account.html',
                controller: 'AccountController',
                controllerAs: 'vm',
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
