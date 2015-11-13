(function () {
    'use strict';

    angular
        .module('qorDash.manage.settings.authentication.domain')
        .controller('AuthenticationDomainController', authenticationDomainController);

    function authenticationDomainController(authenticationService, resolvedDomain, resolvedToken, Notification, $stateParams) {
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
            switch (type) {
                case 'edit-value':
                    updateObject('edit-value', vm.domain, path, data);
                    break;
                case 'edit-key':
                    updateObject('edit-key', vm.domain, path, null, key, data);
                    break;
                case 'add-value':
                    updateObject('add-value', vm.domain, path);
                    break;
                case 'add-object':
                    updateObject('add-object', vm.domain, path, data, null, key);
                    break;
                default:
                    throw 'unknown type';
            }

            vm.isDataChanged = true;
        }

        function updateObject(type, object, path, newValue, oldKey, newKey){
            var stack = path.split('.');
            if (stack[0] === '') {
                stack.splice(0, 1);
            }

            while(stack.length > 1){
                object = object[stack.shift()];
            }

            switch (type) {
                case 'edit-value':
                    object[stack.shift()] = newValue;
                    break;
                case 'edit-key':
                    object = object[stack.shift()];
                    object[newKey] = object[oldKey];
                    delete object[oldKey];
                    break;
                case 'add-value':
                    object[stack.shift()].push('');
                    break;
                case 'add-object':
                    object = object[stack.shift()];
                    if (angular.isArray(object)) {
                        object.push(jQuery.extend(true, {}, newValue));
                    } else {
                        object[newKey] = jQuery.extend(true, {}, newValue);
                    }
                    break;
                default:
                    throw 'unknown type';
            }
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
