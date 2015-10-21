(function () {
    'use strict';

    angular.module('qorDash.auth')
        .controller('LoginController', loginController);

    function loginController($state, user, LOGIN_PAGE_ICON_URL) {
        var vm = this;

        vm.login = login;
        vm.removeError = removeError;

        vm.ICON_URL = LOGIN_PAGE_ICON_URL;
        vm.userCredentials = {};

        vm.loginButtonLoadingState = false;

        if (user.isAuthed()) {
            $state.go('app.dashboard');
            return;
        }

        function login() {
            startLoginAnimation();
            user.login(vm.userCredentials.login, vm.userCredentials.password).then(
                function (response) {
                    $state.go('app.dashboard');
                },
                function (response) {
                    var errorCode = response && response.data && response.data.error ? response.data.error : 'unknown';
                    vm.loginForm.$setValidity(errorCode, false);
                    stopLoginAnimation();
                });
        }

        function removeError() {
          if (vm.loginForm.$invalid && vm.loginForm.$submitted){
            vm.loginForm.$setPristine();
            vm.loginForm.$setUntouched();
            for (var errorCode in vm.loginForm.$error) {
              vm.loginForm.$setValidity(errorCode, true);
            }
          }
        }

        function startLoginAnimation() {
            vm.loginButtonLoadingState = true;
        }

        function stopLoginAnimation() {
            vm.loginButtonLoadingState = false;
        }
    }
})();
