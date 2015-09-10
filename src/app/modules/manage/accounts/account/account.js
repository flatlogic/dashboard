(function () {
    'use strict';

    angular.module('qorDash.manage.accounts')
        .controller('AccountController',accountController);


    accountController.$inject = ['$scope', '$http', '$stateParams', 'AUTH_API_URL', 'Notification', 'currentUser'];
    function accountController ($scope, $http, $stateParams, AUTH_API_URL, Notification, currentUser) {
        currentUser.then(function () {
            $scope.token = currentUser.$$state.value;
        });

        var accountId = $stateParams.id;

        $scope.$watch('token', function (token) {
            if (!token) return;

            $http({
                method: 'GET',
                url: AUTH_API_URL + '/account/' + accountId,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then(function(data) {
                $scope.account = data.data;
            }, function(e) {
                var error = e ? e.error : 'unknown server error';
                Notification.error('Can\'t load data: ' + error);
                $scope.error = error;
            });
    })


}

})();
