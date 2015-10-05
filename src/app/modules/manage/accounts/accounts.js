(function () {
    'use strict';

    angular.module('qorDash.manage.accounts')
        .controller('AccountsController',accountsController)
        .controller('NewUserController', newUserController);


    accountsController.$inject = ['$scope', 'accountsService', 'errorHandler', 'Notification', '$modal', 'currentUser'];
    function accountsController ($scope, accountsService, errorHandler, Notification, $modal, currentUser) {
        currentUser.then(function () {
            $scope.token = currentUser.$$state.value;
        });

        $scope.$watch('token', function (token) {
            if (!token) return;

            accountsService.getAccounts(token).then(function(data) {
                $scope.accounts = data.data;
            }, function(response) {
                $scope.error = errorHandler.showError(response);
            });

            $scope.addUser = function(username, password, custom_object){
                return accountsService.createAccount(username, password, custom_object, token).then(function(e) {
                    $scope.accounts.push({id: e.data.id, primary: e.data});
                    Notification.success('Successfully created');
                }, function(response) {
                    $scope.error = errorHandler.showError(response);
                });
            }
        });


        $scope.$watch('accounts', function (accounts) {
            if (!accounts) return;

            $scope.newUser = function () {
                $modal.open({
                    animation: true,
                    templateUrl: 'app/modules/manage/accounts/new-user-modal.html',
                    controller: 'NewUserController',
                    resolve: {
                        accounts: function () {
                            return $scope.accounts;
                        },
                        addUser: function () {
                            return $scope.addUser;
                        }
                    }
                });
            }
        })
    }

    newUserController.$inject = ['$scope', 'accounts', 'addUser', '$modalInstance'];
    function newUserController ($scope, accounts, addUser, $modalInstance) {
        $scope.accounts = accounts;

        $scope.ok = function () {
            addUser($scope.username, $scope.password, $scope.custom_object).then(function () {
                $modalInstance.close();
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }


})();
