(function () {
    'use strict';

    angular.module('qorDash.auth')
        .controller('LoginController', loginController);

    loginController.$inject = ['$scope', '$state', 'user', 'LOGIN_PAGE_ICON_URL'];
    function loginController($scope, $state, user, LOGIN_PAGE_ICON_URL) {
        var vm = this;

        vm.startLoginAnimation = startLoginAnimation;
        vm.stopLoginAnimation = stopLoginAnimation;
        vm.showErrorMessage = showErrorMessage;
        vm.login = login;

        vm.ICON_URL = LOGIN_PAGE_ICON_URL;
        vm.userCredentials = {
            login: '',
            password: ''
        };

        if (user.isAuthed()) {
            $state.go('app.dashboard');
            return;
        }

        $scope.$watch('vm.userCredentials.login', removeError);
        $scope.$watch('vm.userCredentials.password', removeError);

        function removeError() {
            var hasFeedbackSelector = '.has-feedback',
                hasClass = 'has-error';
            if ($(hasFeedbackSelector).hasClass(hasClass)) {
                $(hasFeedbackSelector).removeClass(hasClass);
                vm.errorMessage = '';
            }
        }

        function startLoginAnimation() {
            $('#loginButton').button('loading');
        }

        function stopLoginAnimation() {
            $('#loginButton').button('reset');
        }

        function showErrorMessage(message) {
            vm.errorMessage = message;

            $('.has-feedback').addClass('has-error');
        }

        function login() {
            vm.startLoginAnimation();
            //TODO then
            user.login(vm.userCredentials.login, vm.userCredentials.password).then(
                function (response) {
                    $state.go('app.dashboard');
                },
                function (response) {
                    var e;
                    if (response && response.data) {
                        e = response.data;
                    } else {
                        e = {};
                    }

                    if (!e) {
                        e = {'error': 'unknown'};
                    }

                    switch (e.error) {
                        case 'error-account-not-found':
                            vm.showErrorMessage('Account not found');
                            break;
                        case 'error-bad-credentials':
                            vm.showErrorMessage('Bad credentials');
                            break;
                        default:
                            vm.showErrorMessage('Unknown server error');
                            break;
                    }

                    vm.stopLoginAnimation();
                });
        }
    }
})();