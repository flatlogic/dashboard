(function () {
    'use strict';

    angular
        .module('qorDash.auth')
        .factory('oauthProviderGitHub', oauthProviderGitHub);

    function oauthProviderGitHub($http, $q, AUTH_API_URL, GITHUB_CLIENT_ID, githubOauth) {
        var service = {
            login         : login,
            exchangeToken : exchangeToken
        };

        function login() {
            return githubOauth.openPopup({
                clientId    : GITHUB_CLIENT_ID,
                redirectUri : 'http://dashboard.qoriolabs.com',
                state       : githubOauth.state,
                scope       : ''
            });
        }

        function exchangeToken(code) {
            return $http({
                method: 'POST',
                url: AUTH_API_URL + '/auth',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    'oauth2_code': code,
                    'oauth2_state': githubOauth.state,
                    'oauth2_provider': 'github.com'
                }
            });
        }

        return service;
    }
})();
