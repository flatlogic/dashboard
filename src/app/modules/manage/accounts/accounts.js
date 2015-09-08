(function () {
    'use strict';

    angular.module('qorDash.manage.accounts')
        .controller('AccountsController',accountsController)
        .controller('NewUserController', newUserController);


    accountsController.$inject = ['$scope', '$http', 'AUTH_API_URL', 'Notification', '$modal', 'currentUser'];
    function accountsController ($scope, $http, AUTH_API_URL, Notification, $modal, currentUser) {
        currentUser.then(function () {
            $scope.token = currentUser.$$state.value;
        });

        $scope.$watch('token', function (token) {
            if (!token) return;

            console.log('Ac token: ' + token);

            $http({
                method: 'GET',
                url: AUTH_API_URL + '/account/',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then(function(data) {
                $scope.accounts = data.data;
            }, function(e) {
                var error = e ? e.error : 'unknown server error';
                Notification.error('Can\'t load data: ' + error);
            });

            $scope.addUser = function(username, password, custom_object){
                return $http({
                    method: 'POST',
                    url: AUTH_API_URL + '/register',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    data: {
                        "identity": {
                            "username": username,
                            "password": password
                        },
                        "custom_object": custom_object
                    }
                }).then(function(e) {
                    $scope.accounts.push({id: e.data.id, primary: e.data});
                    Notification.success('Yo, you have done it');
                }, function(e) {
                    var error = e ? e.error : 'unknown server error';
                    Notification.error('Can\'t load data: ' + error);
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
