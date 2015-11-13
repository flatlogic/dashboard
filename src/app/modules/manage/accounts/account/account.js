(function () {
    'use strict';

    angular
        .module('qorDash.manage.accounts')
        .controller('AccountController',accountController);

    function accountController ($scope, accountsService, $stateParams, errorHandler, resolvedToken, resolvedAccount) {
        var vm = this;

        vm.config = {
            ".services": "add"
        };
        vm.isDataChanged = false;
        vm.dataChanged = dataChanged;
        vm.save = save;

        vm.account = resolvedAccount;

        function dataChanged(type, path, data, key) {
            switch (type) {
                case 'edit-value':
                    updateObject('edit-value', vm.account, path, data);
                    break;
                case 'edit-key':
                    updateObject('edit-key', vm.account, path, null, key, data);
                    break;
                case 'add-value':
                    updateObject('add-value', vm.account, path);
                    break;
                case 'add-object':
                    updateObject('add-object', vm.account, path, data, null, key);
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
                        object.push(angular.copy(newValue));
                    } else {
                        object[newKey] = angular.copy(newValue);
                    }
                    break;
                default:
                    throw 'unknown type';
            }
        }

        function save() {
            vm.isDataChanged = false;
            alert('Need to save');
        }
}

})();
