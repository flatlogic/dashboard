(function () {
    'use strict';

    angular
        .module('qorDash.auth.oauth')
        .factory('oauthAdapter', oauthAdapter);

    function oauthAdapter($q, auth, errorHandler, oauthProviderGoogle, oauthProviderGitHub) {

        var _selectedProvider = null;

        return {
            _selectedProvider: _selectedProvider,
            init: init,
            login: login,
            logout: logout,
            exchangeToken: exchangeToken
        };

        function init(provider) {
            var deferred = $q.defer();
            _selectedProvider = provider;
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
    }
})();
