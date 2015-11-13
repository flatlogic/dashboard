(function () {
    'use strict';

    angular
        .module('qorDash.manage.accounts')
        .controller('AccountController',accountController);

    function accountController (resolvedAccount,objectEdit) {
        var vm = this;

        vm.config = {
            ".services": "add"
        };
        vm.isDataChanged = false;
        vm.dataChanged = dataChanged;
        vm.save = save;

        vm.account = resolvedAccount;

        function dataChanged(type, path, data, key) {
            objectEdit.dataChanged(vm.account, type, path, data, key);

            vm.isDataChanged = true;
        }

        function save() {
            vm.isDataChanged = false;
            alert('Need to save');
        }
}

})();
