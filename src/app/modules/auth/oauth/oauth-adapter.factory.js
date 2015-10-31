(function () {
    'use strict';

    angular
        .module('qorDash.auth')
        .factory('oauthAdapter', oauthAdapter);

    function oauthAdapter($q, auth, errorHandler, oauthProviderGoogle, oauthProviderGitHub) {

        var selectedProvider = null;
        var providersMap = {
            'google': oauthProviderGoogle,
            'github': oauthProviderGitHub
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
                .then(requestSuccess)
                .catch(requestFailed);
        }

        function requestSuccess(response) {
            if (response.data.token) {
                auth.saveToken(response.data.token);
            }
        }

        function requestFailed(error) {
            errorHandler.showError(error);
        }
    }
})();
