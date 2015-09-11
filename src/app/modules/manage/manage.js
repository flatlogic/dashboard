(function () {
    'use strict';



    var manageController = angular.createAuthorizedController('ManageController', ['$scope', function ($scope) {

        }]);


    currentUser.$inject = ['$http', '$q', 'AUTH_API_URL', 'AUTH_API_USER', 'AUTH_API_SECRET', 'errorHandler'];
    function currentUser ($http, $q, AUTH_API_URL, AUTH_API_USER, AUTH_API_SECRET, errorHandler) {
        var deferred = $q.defer();
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
            deferred.resolve(response.data.token)
        }, function(e, code) {
            deferred.reject();
            $scope.error = errorHandler.showError(e, code);
        });

            return deferred.promise;
    }

    angular.module('qorDash.manage')
        .controller(manageController)
        .factory('currentUser', currentUser);
})();
