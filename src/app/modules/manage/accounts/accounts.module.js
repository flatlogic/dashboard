(function () {
    'use strict';

    angular
        .module('qorDash.manage.accounts', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.manage.accounts', {
                url: '/accounts',
                templateUrl: 'app/modules/manage/accounts/accounts.html',
                controller: 'AccountsController',
                controllerAs: 'vm',
                resolve: {
                    resolvedToken: function(manageLoader) {
                        return manageLoader.load();
                    },
                    resolvedAccounts: function(accountsService, resolvedToken) {
                        return accountsService.getAccounts(resolvedToken);
                    }
                }
            });
    }
})();
