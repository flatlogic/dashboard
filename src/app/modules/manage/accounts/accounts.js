(function () {
    'use strict';

    angular.module('qorDash.manage.accounts')
        .controller('AccountsController',accountsController)
        .controller('NewUserController', newUserController);


    accountsController.$inject = ['$scope', 'accountsService', 'errorHandler', 'Notification', '$modal', 'currentUser'];
    function accountsController ($scope, accountsService, errorHandler, Notification, $modal, currentUser) {
        var vm = this;

        vm.newUser = newUser;
        vm.addUser = addUser;
        vm.accounts = [];

        loadToken();

        $scope.$watch('vm.token', function () {
            if (!vm.token) return;
            loadAccounts();
        });

        function addUser(username, email, password, custom_object){
            if (!email) {
                return accountsService.createAccount(username, password, custom_object, vm.token).then(function (response) {
                    vm.accounts.push({id: response.data.id, primary: response.data});
                    Notification.success('Successfully created');
                }, function (response) {
                    vm.error = errorHandler.showError(response);
                });
            } else {
                return accountsService.createGoogleAccount(username, email, vm.token).then(function (response) {
                    vm.accounts.push({id: response.data.id, primary: response.data});
                    Notification.success('Successfully created');
                }, function (response) {
                    vm.error = errorHandler.showError(response);
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

        function loadAccounts() {
            accountsService.getAccounts(vm.token).then(function(response) {
                vm.accounts = response.data;
            }, function(response) {
                vm.error = errorHandler.showError(response);
            });
        }

        function loadToken() {
            currentUser.then(function () {
                vm.token = currentUser.$$state.value;
            });
        }
    }

    newUserController.$inject = ['accounts', 'addUser', '$modalInstance'];
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
