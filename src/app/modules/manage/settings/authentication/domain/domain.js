(function () {
    'use strict';

    angular.module('qorDash.manage.settings.authentication.domain')
        .controller('AuthenticationDomainController', authenticationDomainController);


    authenticationDomainController.$inject = ['$scope', 'authenticationService', 'errorHandler', 'currentUser', '$stateParams'];
    function authenticationDomainController ($scope, authenticationService, errorHandler, currentUser, $stateParams) {
        $scope.loadDomain = loadDomain;

        $scope.itemsForSave = [];

        $scope.dataChanged = function(pathToArray, data) {
            var obj = {};
            obj[pathToArray] = data;
            $scope.itemsForSave.push(obj);
        };

        loadDomain();

        currentUser.then(function () {
            $scope.token = currentUser.$$state.value;
        });

        function loadDomain() {
            $scope.$watch('token', function (token) {
                if (!token) return;

                authenticationService.getDomainInfo($stateParams.authDomain, token).then(
                    function(response) {
                        $scope.domain = response.data;
                    }, function(response) {
                        errorHandler.showError(response);
                    }
                );
            });
        }
    }

})();
