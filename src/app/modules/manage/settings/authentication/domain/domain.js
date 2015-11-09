(function () {
    'use strict';

    angular.module('qorDash.manage.settings.authentication.domain')
        .controller('AuthenticationDomainController', authenticationDomainController);

    function authenticationDomainController($scope, authenticationService, errorHandler, currentUser, Notification, $stateParams) {
        var vm = this;

        vm.loadDomain = loadDomain;
        vm.dataChanged = dataChanged;
        vm.save = save;

        vm.isDataChanged = false;

        vm.configObject = {
            ".services": "add|edit",
            ".services.*.webhooks"  : "add|edit",
            ".services.*.new_account_preset.scopes" : "add|edit",
            ".url" : "edit",
            ".name" : "edit",
            "." : "add|edit"
        };

        loadDomain();

        currentUser.then(function (token) {
            vm.token = token;
        });

        function loadDomain() {
            $scope.$watch('vm.token', function (token) {
                if (!token) return;

                authenticationService.getDomainInfo($stateParams.authDomain, token).then(
                    function(response) {
                        vm.domain = response.data;
                    }, function(response) {
                        errorHandler.showError(response);
                    }
                );
            });
        }

        function dataChanged(type, pathToArray, data, key) {
            switch (type) {
                case 'edit-value':
                    updateObject(vm.domain, data, pathToArray);
                    break;
                case 'edit-key':
                    updateKey(vm.domain, pathToArray, data, key);
                    break;
                case 'add-value':
                    addValueToArray(vm.domain, pathToArray);
                    break;
                case 'add-object':
                    addNewObject(vm.domain, pathToArray, data, key);
                    break;
                default:
                    throw 'unknown type';
            }

            vm.isDataChanged = true;
        }

        function updateKey(object, path, newKey, oldKey) {
            var stack = path.split('.');
            if (stack[0] === '') {
                stack.splice(0, 1);
            }

            while(stack.length > 0){
                object = object[stack.shift()];
            }

            object[newKey] = object[oldKey];
            delete object[oldKey];
        }

        function addNewObject(object, path, newObject, key) {
            var stack = path.split('.');
            if (stack[0] === '') {
                stack.splice(0, 1);
            }

            while(stack.length > 1){
                object = object[stack.shift()];
            }
            object[stack.shift()][key] = jQuery.extend(true, {}, newObject);
        }

        function updateObject(object, newValue, path){
            var stack = path.split('.');
            if (stack[0] === '') {
                stack.splice(0, 1);
            }

            while(stack.length > 1){
                object = object[stack.shift()];
            }

            object[stack.shift()] = newValue;
        }

        function addValueToArray(object, path) {
            var stack = path.split('.');
            if (stack[0] === '') {
                stack.splice(0, 1);
            }

            while(stack.length > 1){
                object = object[stack.shift()];
            }

            object[stack.shift()].push('');
        }

        function save() {
            if ($stateParams.authDomain === 'blinker.com') {
                authenticationService.saveDomainInfo($stateParams.authDomain, vm.domain, vm.token)
                    .then(function(response) {
                        Notification.success('All changes saved');
                        vm.isDataChanged = false;
                    })
                    .then(null, function(response) {
                        vm.error = errorHandler.showError(response);
                    });
            } else {
                alert('Save is only available for blinker.com');
            }
        }

        function deepFind(obj, path) {
            var paths = path.split('.')
                , current = obj
                , i;

            for (i = 0; i < paths.length; ++i) {
                if (current[paths[i]] == undefined) {
                    return undefined;
                } else {
                    current = current[paths[i]];
                }
            }
            return current;
        }
    }

})();
