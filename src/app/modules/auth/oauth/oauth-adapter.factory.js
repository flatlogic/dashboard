(function () {
    'use strict';

    angular
        .module('qorDash.auth.oauth')
        .factory('oauthAdapter', oauthAdapter);

    function oauthAdapter($q, auth, errorHandler, oauthProviderGoogle, oauthProviderGitHub) {

        var _selectedProvider = null;

        function init(provider) {
            _selectedProvider = provider;
            var deferred = $q.defer();
            deferred.resolve(_selectedProvider);
            return deferred.promise;
        }

        function login() {
            return _selectedProvider.login();
        }

        function logout() {
            return _selectedProvider.logout();
        }

        function exchangeToken(user) {
            return _selectedProvider
                .exchangeToken(user)
                .then(auth.saveToken)
                .catch(requestFailed);
        }

        function requestFailed(error) {
            errorHandler.showError(error);
        }

        return {
            _selectedProvider: _selectedProvider,
            init: init,
            login: login,
            logout: logout,
            exchangeToken: exchangeToken
        };
    }
})();
