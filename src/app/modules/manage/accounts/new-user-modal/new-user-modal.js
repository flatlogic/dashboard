(function(){
    'use strict';

    angular.module('qorDash.manage.accounts')
        .controller('NewUserController', newUserController);

    function newUserController (accounts, token, accountsService, errorHandler, Notification, $modalInstance) {
        var vm = this;

        vm.accounts = accounts;
        vm.token = token;
        vm.cancel = cancel;
        vm.addUser = addUser;
        vm.addGoogleUser = addGoogleUser;
        vm.addGitHubUser = addGitHubUser;
        vm._addUserResolve = _addUserResolve;
        vm._addUserReject = _addUserReject;

        function _addUserResolve(response) {
            vm.accounts.push({id: response.data.id, primary: response.data});
            Notification.success('Successfully created');
        }

        function _addUserReject(response) {
            vm.error = errorHandler.showError(response);
        }

        function addUser(username, password, custom_object) {
            return accountsService.createAccount(username, password, custom_object, vm.token)
                .then(vm._addUserResolve, vm._addUserReject);
        }

        function addGoogleUser(username, email) {
            return accountsService.createGoogleAccount(username, email, vm.token)
                .then(vm._addUserResolve, vm._addUserReject);
        }

        function addGitHubUser(username, githubUsername) {
            return accountsService.createGitHubAccount(username, githubUsername, vm.token)
                .then(vm._addUserResolve, vm._addUserReject);
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }
})();
