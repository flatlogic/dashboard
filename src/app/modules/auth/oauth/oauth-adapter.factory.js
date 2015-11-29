(function () {
    'use strict';

    angular
        .module('qorDash.auth.oauth')
        .factory('oauthAdapter', oauthAdapter);

    function oauthAdapter($q, auth, permissions, errorHandler) {

        var _selectedProvider = null;

        return {
            _selectedProvider: _selectedProvider,
            init: init,
            login: login,
            logout: logout,
            exchangeToken: exchangeToken
        };

        function init(provider) {
            _selectedProvider = provider;
            return $q.when(_selectedProvider);
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
                .then(permissions.save)
                .catch(requestFailed);
        }

        function requestFailed(error) {
            errorHandler.showError(error);
        }
    }
})();
