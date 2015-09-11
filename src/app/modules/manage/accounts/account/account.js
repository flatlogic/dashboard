(function () {
    'use strict';

    angular.module('qorDash.manage.accounts')
        .controller('AccountController',accountController);


    accountController.$inject = ['$scope', '$http', '$stateParams', 'AUTH_API_URL', 'errorHandler', 'currentUser'];
    function accountController ($scope, $http, $stateParams, AUTH_API_URL, errorHandler, currentUser) {
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
            }, function(e, code) {
                $scope.error = errorHandler.showError(e, code);
            });
    })


}

})();
