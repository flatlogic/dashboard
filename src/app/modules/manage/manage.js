(function () {
    'use strict';

    var manageController = angular.createAuthorizedController('ManageController', ['$scope', '$http', 'AUTH_API_URL', 'AUTH_API_USER', 'AUTH_API_SECRET', 'Notification',
        function ($scope, $http, AUTH_API_URL, AUTH_API_USER, AUTH_API_SECRET, Notification) {

            $http({
                method: 'POST',
                url: AUTH_API_URL + '/auth',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    'username': AUTH_API_USER,
                    'password': AUTH_API_SECRET
                }
            }).then(function(response) {
                    $scope.tokenResult = response.data;
                },
                function(e) {
                    var error = e ? e.error : 'unknown server error';
                    Notification.error('Can\'t load data: ' + error);
                    $scope.loading = false;
                });
        }]);

    angular.module('qorDash.manage')
        .controller(manageController);

})();
