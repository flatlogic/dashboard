(function () {
    'use strict';

    angular.module('qorDash.manage.settings.authentication')
        .controller('AuthenticationSettingsController', authenticationSettingsController);


    authenticationSettingsController.$inject = ['$scope', 'authenticationService', 'errorHandler'];
    function authenticationSettingsController ($scope, authenticationService, errorHandler) {
        loadDomains();

        function loadDomains() {
            authenticationService.getDomains().then(
                function(response){
                    if (response.data.error) {
                        $scope.error = errorHandler.showError(response);
                        return;
                    }
                    $scope.domains = response.data;
                },
                function(response){
                    $scope.error = errorHandler.showError(response);
                }
            )
        }
    }

})();
