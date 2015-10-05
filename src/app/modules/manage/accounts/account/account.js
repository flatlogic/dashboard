(function () {
    'use strict';

    angular.module('qorDash.manage.accounts')
        .controller('AccountController',accountController);


    accountController.$inject = ['$scope', 'accountsService', '$stateParams', 'errorHandler', 'currentUser'];
    function accountController ($scope, accountsService, $stateParams, errorHandler, currentUser) {
        currentUser.then(function () {
            $scope.token = currentUser.$$state.value;
        });

        var accountId = $stateParams.id;

        $scope.$watch('token', function (token) {
            if (!token) return;

            accountsService.getAccountById(accountId, token).then(function(data) {
                $scope.account = data.data;
            }, function(e, code) {
                $scope.error = errorHandler.showError(e, code);
            });
    })


}

})();
