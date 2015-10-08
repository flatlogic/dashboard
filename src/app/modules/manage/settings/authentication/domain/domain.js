(function () {
    'use strict';

    angular.module('qorDash.manage.settings.authentication.domain')
        .controller('AuthenticationDomainController', authenticationDomainController);


    authenticationDomainController.$inject = ['$scope', 'authenticationService', 'errorHandler', 'currentUser', '$stateParams'];
    function authenticationDomainController ($scope, authenticationService, errorHandler, currentUser, $stateParams) {
        $scope.loadDomain = loadDomain;

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
