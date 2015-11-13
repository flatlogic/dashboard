(function () {
    'use strict';

    angular
        .module('qorDash.manage.accounts')
        .controller('AccountsController',accountsController)
        .controller('NewUserController', newUserController);

    function accountsController (accountsService, errorHandler, Notification, $modal, resolvedToken, resolvedAccounts) {
        var vm = this;

        vm.newUser = newUser;
        vm.addUser = addUser;

        vm.token = resolvedToken;
        vm.accounts = resolvedAccounts;

        function addUser(username, email, password, custom_object){
            if (!email) {
                return accountsService.createAccount(username, password, custom_object, vm.token).then(function (response) {
                    vm.accounts.push({id: response.id, primary: response});
                    Notification.success('Successfully created');
                });
            } else {
                return accountsService.createGoogleAccount(username, email, vm.token).then(function (response) {
                    vm.accounts.push({id: response.id, primary: response});
                    Notification.success('Successfully created');
                });
            }
        }

        function newUser() {
            $modal.open({
                animation: true,
                templateUrl: 'app/modules/manage/accounts/new-user-modal.html',
                controller: 'NewUserController',
                controllerAs: 'vm',
                resolve: {
                    accounts: function () {
                        return vm.accounts;
                    },
                    addUser: function () {
                        return vm.addUser;
                    }
                }
            });
        }
    }

    function newUserController (accounts, addUser, $modalInstance) {
        var vm = this;

        vm.accounts = accounts;
        vm.ok = ok;
        vm.cancel = cancel;

        function ok() {
            if ((vm.username && vm.email) || (vm.username && vm.password && vm.custom_object)) {
                addUser(vm.username, vm.email, vm.password, vm.custom_object).then(function () {
                    $modalInstance.close();
                });
            }
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }


})();
