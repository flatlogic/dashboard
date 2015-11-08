(function () {
    'use strict';

    angular
        .module('qorDash.auth')
        .factory('oauthAdapter', oauthAdapter);

    function oauthAdapter($q, auth, errorHandler, oauthProviderGoogle) {

        var selectedProvider = null;
        var providersMap = {
            'google': oauthProviderGoogle
        };

        return {
            init: init,
            login: login,
            logout: logout,
            exchangeToken: exchangeToken
        };

        function init(providerName) {
            selectedProvider = providersMap[providerName];
            var deferred = $q.defer();
            deferred.resolve(selectedProvider);
            return deferred.promise;
        }

        function login() {
            return selectedProvider.login();
        }

        function logout() {
            return selectedProvider.logout();
        }

        function exchangeToken(user) {
            return selectedProvider
                .exchangeToken(user)
                .then(auth.saveToken)
                .catch(requestFailed);
        }

        function requestFailed(error) {
            errorHandler.showError(error);
        }
    }
})();
