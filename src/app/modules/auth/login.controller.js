(function () {
    'use strict';

    angular.module('qorDash.auth')
        .controller('LoginController', loginController);

    loginController.$inject = ['$scope', '$state', 'user', 'LOGIN_PAGE_ICON_URL'];
    function loginController($scope, $state, user, LOGIN_PAGE_ICON_URL) {
        var vm = this;

        vm.login = login;

        vm.ICON_URL = LOGIN_PAGE_ICON_URL;
        vm.userCredentials = {
            login: '',
            password: ''
        };

        vm.loginButtonLoadingState = false;

        if (user.isAuthed()) {
            $state.go('app.dashboard');
            return;
        }

        $scope.$watch('vm.userCredentials.login', removeError);
        $scope.$watch('vm.userCredentials.password', removeError);

        function login() {
            startLoginAnimation();
            user.login(vm.userCredentials.login, vm.userCredentials.password).then(
                function (response) {
                    $state.go('app.dashboard');
                },
                function (response) {
                    vm.loginForm.$error.response = response.data.error ? response.data.error : {'error': 'unknown'};
                    stopLoginAnimation();
                });
        }

        function removeError() {
            vm.loginForm.$error.response = '';
        }

        function startLoginAnimation() {
            vm.loginButtonLoadingState = true;
        }

        function stopLoginAnimation() {
            vm.loginButtonLoadingState = false;
        }
    }
})();