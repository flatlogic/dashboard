(function () {
    'use strict';

    angular
        .module('qorDash.manage.settings.authentication.domain')
        .controller('AuthenticationDomainController', authenticationDomainController);

    function authenticationDomainController(authenticationService, resolvedDomain, resolvedToken, Notification, $stateParams, objectEdit) {
        var vm = this;

        vm.dataChanged = dataChanged;
        vm.save = save;

        vm.token = resolvedToken;
        vm.domain = resolvedDomain;

        vm.isDataChanged = false;

        vm.configObject = {
            ".services": "add|edit",
            ".services.*.webhooks"  : "add|edit",
            ".services.*.new_account_preset.scopes" : "add|edit",
            ".url" : "edit",
            ".name" : "edit",
            "." : "add|edit"
        };

        function dataChanged(type, path, data, key) {
            objectEdit.dataChanged(vm.domain, type, path, data, key);

            vm.isDataChanged = true;
        }

        function save() {
            vm.isSaveLoading = true;
            if ($stateParams.authDomain === 'blinker.com') {
                authenticationService.saveDomainInfo($stateParams.authDomain, vm.domain, vm.token)
                    .then(function() {
                        vm.isDataChanged = false;
                        vm.isSaveLoading = false;
                        Notification.success('All changes saved');
                    });
            } else {
                alert('Save is only available for blinker.com');
            }
        }
    }

})();
