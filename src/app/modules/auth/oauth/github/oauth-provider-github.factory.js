(function () {
    'use strict';

    angular
        .module('qorDash.auth')
        .factory('oauthProviderGitHub', oauthProviderGitHub);

    function oauthProviderGitHub($http, $q, AUTH_API_URL, GITHUB_CLIENT_ID, githubOauth) {
        var service = {
            login         : login,
            exchangeToken : exchangeToken,
            _state        : githubOauth.generateState()
        };

        function login() {
            return githubOauth.openPopup({
                clientId    : GITHUB_CLIENT_ID,
                redirectUri : 'http://dashboard.qoriolabs.com',
                state       : service._state,
                scope       : ''
            });
        }

        function exchangeToken(code) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: AUTH_API_URL + '/auth',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    'oauth2_code': code,
                    'oauth2_state': service._state,
                    'oauth2_provider': 'github.com'
                }
            }).then(function(res){
                if (res.data.state == service._state) {
                    deferred.resolve(res);
                } else {
                    deferred.reject({error: 'state mismatch error'});
                }
            }, deferred.reject);

            return deferred.promise;
        }

        return service;
    }
})();
