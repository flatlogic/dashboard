(function () {
    'use strict';

    angular.module('qorDash.auth')
        .controller('LoginController', loginController);

    loginController.$inject = ['$scope', '$state', 'user', 'LOGIN_PAGE_ICON_URL', '$rootScope'];
    function loginController($scope, $state, user, LOGIN_PAGE_ICON_URL, $rootScope) {
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
        vm.loginButtonLoadingState = false;

        if (user.isAuthed()) {
            $state.go('app.dashboard');
            return;
        }

        $rootScope.$on('event:google-signin-success', function(event, googleUser) {
            if (!user.isAuthed()) {
                user.googleLogin(googleUser.wc.access_token).then(
                    function() {
                        console.log('successful google login');
                    }, function() {
                        console.log('google login failed');
                    }
                )
            }
        });

        $rootScope.$on('event:google-signin-failure', function(event, googleUser) {
            //TODO Show error
        });

        $scope.$watch('vm.userCredentials.login', removeError);
        $scope.$watch('vm.userCredentials.password', removeError);

        function removeError() {
            vm.errorMessage = '';
        }

        function startLoginAnimation() {
            vm.loginButtonLoadingState = true;
        }

        function stopLoginAnimation() {
            vm.loginButtonLoadingState = false;
        }

        function showErrorMessage(message) {
            vm.errorMessage = message;
        }

        function login() {
            vm.startLoginAnimation();
            user.login(vm.userCredentials.login, vm.userCredentials.password).then(
                function (response) {
                    $state.go('app.dashboard');
                },
                function (response) {
                    var e;
                    if (response && response.data) {
                        e = response.data;
                    } else {
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