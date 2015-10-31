(function () {
    'use strict';

    angular
        .module('qorDash.auth')
        .directive('githubSignin', githubSignin);

    function githubSignin(oauthAdapter, errorHandler) {
        return {
            scope: {
                onSuccess: '='
            },
            restrict: 'A',
            link: linkFn,
            controller: CtrlFn,
            controllerAs: 'vm',
            bindToController: true
        };

        function linkFn(scope, $element) {

            function login() {
                oauthAdapter
                    .init('github')
                    .then(oauthAdapter.login)
                    .then(scope.vm.successLogin)
                    .catch(scope.vm.failedLogin);
            }

            $element.on('click', login);
            scope.$on('$destroy', function () {
              $element.off('click', login);
            });
        }

        function CtrlFn() {
            var vm = this;
            vm.successLogin = successLogin;
            vm.failedLogin = failedLogin;

            function successLogin(user) {
                return oauthAdapter.exchangeToken(user).then(vm.onSuccess);
            }

            function failedLogin (error) {
                errorHandler.showError(error);
            }
        }
    }
})();
