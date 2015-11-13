(function () {
    'use strict';

    angular
        .module('qorDash.auth.oauth')
        .directive('oauthSigninButton', oauthSigninButton);

    function oauthSigninButton(oauthAdapter, errorHandler, oauthProviderGoogle, oauthProviderGitHub) {
        return {
            scope: {
                onSuccess: '=',
                provider: '@'
            },
            restrict: 'E',
            replace: true,
            link: linkFn,
            controller: CtrlFn,
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'app/modules/auth/oauth/oauth-signin-button.html'
        };

        function linkFn(scope, $element, attrs) {
            var providersMap = {
                'google': {
                    oauthProvider: oauthProviderGoogle,
                    name: 'Google',
                    iconClass: 'fa fa-google'
                },
                'github': {
                    oauthProvider: oauthProviderGitHub,
                    name: 'GitHub',
                    iconClass: 'fa fa-github'
                }
            };

            scope.provider = providersMap[attrs.provider];

            function login() {
                oauthAdapter
                    .init(scope.provider.oauthProvider)
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
