(function () {
    'use strict';

    angular
        .module('qorDash.auth')
        .factory('oauthProviderGitHub', oauthProviderGitHub);

    function oauthProviderGitHub($http, $q, AUTH_API_URL, GITHUB_CLIENT_ID, $window) {
        var GITHUB_AUTH_API_URL = 'https://github.com/login/oauth/authorize';
        var GITHUB_REDIRECT_URI = 'http://dashboard.qoriolabs.com';

        var service = {
            login                              : login,
            exchangeToken                      : exchangeToken,
            GITHUB_AUTH_API_URL                : GITHUB_AUTH_API_URL,
            loginWithGitHubIfRedirectedByPopup : loginWithGitHubIfRedirectedByPopup,
            openPopup                          : openPopup,
            _openPopupWindow                   : _openPopupWindow,
            _buildPopupUrl                     : _buildPopupUrl,
            _setReferer                        : _setReferer,
            _isGitHubPopup                     : _isGitHubPopup,
            _parseCode                         : _parseCode
        };

        function _parseCode() {
            var match = $window.location.href.match(/\?code=(.*)&state/);

            return (match) ? match[1] : null;
        }

        function _isGitHubPopup() {
            if ($window.opener) {
                return Boolean($window.opener.isGitHubPopupReferer)
            } else {
                return false;
            }
        }

        function _setReferer() {
            $window.isGitHubPopupReferer = true;
        }

        function _buildPopupUrl(options) {
            return (GITHUB_AUTH_API_URL
                + '?client_id='
                + options.clientId
                + '&redirect_uri='
                + options.redirectUri
                + '&state='
                + options.state
                + '&scope='
                + options.scope);
        }

        function _openPopupWindow(options) {
            service._setReferer();
            return $window.open(service._buildPopupUrl(options), '', "top=100,left=100,width=500,height=500");
        }

        function loginWithGitHubIfRedirectedByPopup() {
            if (service._isGitHubPopup()) {
                $window.opener.oAuthCallbackGitHub(service._parseCode());
            }
        }

        function openPopup(options) {
            var deferred = $q.defer();
            var popup = service._openPopupWindow(options);

            $window.oAuthCallbackGitHub = function(code){
                popup.close();
                deferred.resolve(code);
            };

            return deferred.promise;
        }

        function login() {
            return service.openPopup({
                clientId: GITHUB_CLIENT_ID,
                redirectUri: GITHUB_REDIRECT_URI,
                state: 'test-state',
                scope: ''
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
                    'oauth2_state': 'test-state',
                    'oauth2_provider': 'github.com'
                }
            });
        }

        return service;
    }
})();
