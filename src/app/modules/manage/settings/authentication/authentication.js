(function () {
    'use strict';

    angular.module('qorDash.manage.settings.authentication')
        .controller('AuthenticationSettingsController', authenticationSettingsController);


    authenticationSettingsController.$inject = ['$scope', 'authenticationService', 'errorHandler'];
    function authenticationSettingsController ($scope, authenticationService, errorHandler) {
        $scope.loadDomains = loadDomains;

        loadDomains();

        function loadDomains() {
            authenticationService.getDomains().then(
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
        }
    }

})();
