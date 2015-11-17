(function(){
    'use strict';

    angular.module('qorDash.manage.accounts')
        .controller('NewUserModalController', newUserModalController);

    function newUserModalController (accounts, token, accountsService, errorHandler, Notification, $modalInstance) {
        var vm = this;

        vm.accounts = accounts;
        vm.token = token;
        vm.cancel = cancel;
        vm.addUser = addUser;
        vm.addGoogleUser = addGoogleUser;
        vm.addGitHubUser = addGitHubUser;
        vm._addUserResolve = _addUserResolve;

        function _addUserResolve(res) {
            vm.accounts.push({id: res.id, primary: res});
            Notification.success('Successfully created');
        }

        function addUser(username, password, custom_object) {
            return accountsService.createAccount(username, password, custom_object, vm.token)
                .then(vm._addUserResolve);
        }

        function addGoogleUser(username, email) {
            return accountsService.createGoogleAccount(username, email, vm.token)
                .then(vm._addUserResolve);
        }

        function addGitHubUser(username, githubUsername) {
            return accountsService.createGitHubAccount(username, githubUsername, vm.token)
                .then(vm._addUserResolve);
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }
})();
