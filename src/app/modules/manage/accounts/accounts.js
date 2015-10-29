(function () {
    'use strict';

    angular.module('qorDash.manage.accounts')
        .controller('AccountsController',accountsController);

    accountsController.$inject = ['$scope', 'accountsService', 'errorHandler', '$modal', 'currentUser'];
    function accountsController ($scope, accountsService, errorHandler, $modal, currentUser) {
        var vm = this;

        vm.newUser = newUser;
        vm.accounts = [];

        function newUser() {
            $modal.open({
                animation: true,
                templateUrl: 'app/modules/manage/accounts/new-user-modal/new-user-modal.html',
                controller: 'NewUserController',
                controllerAs: 'vm',
                resolve: {
                    accounts: function() {
                        return vm.accounts;
                    },
                    token: function() {
                        return vm.token;
                    }
                }
            });
        }

        currentUser.then(function (token) {
            vm.token = token;
        });

        $scope.$watch('vm.token', function () {
            if (!vm.token) return;

            accountsService.getAccounts(vm.token).then(function(response) {
                vm.accounts = response.data;
            }, function(response) {
                vm.error = errorHandler.showError(response);
            });
        });
    }
})();
