(function () {
    'use strict';

    angular
        .module('qorDash.manage.accounts')
        .controller('AccountsController', accountsController)

    function accountsController (resolvedAccounts, resolvedToken, $modal) {
        var vm = this;

        vm.newUser = newUser;
        vm.token = resolvedToken;
        vm.accounts = resolvedAccounts;

        function newUser() {
            $modal.open({
                animation: true,
                templateUrl: 'app/modules/manage/accounts/new-user-modal/new-user-modal.html',
                controller: 'NewUserModalController',
                controllerAs: 'vm',
                resolve: {
                    resolvedAccounts: function() {
                        return vm.accounts;
                    },
                    resolvedToken: function() {
                        return vm.token;
                    }
                }
            });
        }
    }
})();
