(function () {
    'use strict';

    angular.module('qorDash.manage.settings.authentication')
        .controller('AuthenticationSettingsController', authenticationSettingsController);


    authenticationSettingsController.$inject = ['$scope', 'authenticationService', 'errorHandler'];
    function authenticationSettingsController ($scope, authenticationService, errorHandler) {
        var vm = this;

        vm.domains = [];
        vm.loadDomains = loadDomains;

        loadDomains();

        function loadDomains() {
            authenticationService.getDomains().then(
                function(response){
                    vm.domains = response.data;
                },
                function(response){
                    errorHandler(response);
                }
            )
        }
    }

})();
