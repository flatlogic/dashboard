(function () {
    'use strict';

    angular.module('qorDash.manage.accounts')
        .controller('AccountController',accountController);

    function accountController ($scope, accountsService, $stateParams, errorHandler, currentUser) {
        var vm = this;

        vm.config = {};
        vm.isDataChanged = false;
        vm.dataChanged = dataChanged;
        vm.save = save;

        currentUser.then(function (token) {
            vm.token = token;
        });

        $scope.$watch('vm.token', function (token) {
            if (!token) return;

            accountsService.getAccountById($stateParams.id, token).then(function(response) {
                vm.account = response.data;
            }, function(response) {
                vm.error = errorHandler.showError(response);
            });
        });

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
                    object[stack.shift()][newKey] = jQuery.extend(true, {}, newValue);
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
