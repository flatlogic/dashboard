(function () {
    'use strict';

    angular
        .module('qorDash.auth')
        .factory('oauthProviderGoogle', oauthProviderGoogle);

    function oauthProviderGoogle($http, $q, AUTH_API_URL, GOOGLE_CLIENT_ID) {

        var providerData = {
            client_id: GOOGLE_CLIENT_ID,
            cookie_policy: 'single_host_origin',
        };

        return {
            login: login,
            logout: logout,
            exchangeToken: exchangeToken
        };

        function googleApi(){
            var deferred = $q.defer();
            gapi.load('auth2', function(){
                deferred.resolve(gapi);
            });
            return deferred.promise;
        }

        function login() {
            return googleApi().then(function(gapi){
                var auth2 = gapi.auth2.init(providerData);
                return auth2.signIn({
                    scope: 'openid'
                });
            });
        }

        function logout() {
            return googleApi().then(function(gapi){
                var auth2 = gapi.auth2.getAuthInstance();
                return auth2.signOut();
            });
        }

        function exchangeToken(user) {
            var accessToken = user.getAuthResponse().access_token;
            return $http
                .post(AUTH_API_URL + '/auth', {
                    'oauth2_access_token': accessToken,
                    'oauth2_provider': 'google.com'
                });
        }

    }
})();
