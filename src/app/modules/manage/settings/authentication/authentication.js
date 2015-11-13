(function () {
    'use strict';

    angular
        .module('qorDash.manage.settings.authentication')
        .controller('AuthenticationSettingsController', authenticationSettingsController);

    function authenticationSettingsController (authenticationService, errorHandler, resolvedToken) {
        var vm = this;

        vm.token = resolvedToken;

        loadDomains();

        function loadDomains() {
            authenticationService.getDomains(vm.token).then(
                function(response){
                    if (!response || response.data.error) {
                        vm.error = errorHandler.showError(response);
                        return;
                    }
                    vm.domains = response.data;
                },
                function(response){
                    vm.error = errorHandler.showError(response);
                }
            )
        }
    }

})();
