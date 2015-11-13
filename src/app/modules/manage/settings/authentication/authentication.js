(function () {
    'use strict';

    angular
        .module('qorDash.manage.settings.authentication')
        .controller('AuthenticationSettingsController', authenticationSettingsController);

    function authenticationSettingsController (resolvedToken, resolvedDomains) {
        var vm = this;

        vm.token = resolvedToken;
        vm.domains = resolvedDomains;
    }

})();
