(function () {
    'use strict';

    angular.module('qorDash.manage.settings.authentication')
        .controller('AuthenticationSettingsController', authenticationSettingsController);


    authenticationSettingsController.$inject = ['$scope', 'authenticationService', 'errorHandler', 'currentUser'];
    function authenticationSettingsController ($scope, authenticationService, errorHandler, currentUser) {
        $scope.loadDomains = loadDomains;

        loadDomains();

        function loadDomains() {
            currentUser.then(function () {
                $scope.token = currentUser.$$state.value;
            });

            $scope.$watch('token', function (token) {
                if (!token) return;

                authenticationService.getDomains(token).then(
                    function(response){
                        if (!response || response.data.error) {
                            $scope.error = errorHandler.showError(response);
                            return;
                        }
                        $scope.domains = response.data;
                    },
                    function(response){
                        $scope.error = errorHandler.showError(response);
                    }
                )
            });
        }
    }

})();
