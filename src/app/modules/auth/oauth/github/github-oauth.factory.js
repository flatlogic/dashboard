(function() {
    'use strict';

    angular
        .module('qorDash.auth')
        .factory('githubOauth', githubOauth);

    function githubOauth($q, $window) {
        var service = {
            GITHUB_AUTH_API_URL                : 'https://github.com/login/oauth/authorize',
            state                              : _generateState(),
            loginWithGitHubIfRedirectedByPopup : loginWithGitHubIfRedirectedByPopup,
            openPopup                          : openPopup,
            _openPopupWindow                   : _openPopupWindow,
            _buildPopupUrl                     : _buildPopupUrl,
            _setReferer                        : _setReferer,
            _isGitHubPopup                     : _isGitHubPopup,
            _parseCode                         : _parseCode,
            _parseState                        : _parseState,
            _generateState                     : _generateState
        };

        /**
         * @return code (string) or null if the code wasn't found
         */
        function _parseCode(url) {
            var match = url.match(/\?code=(.*)&state/);
            return match ? match[1] : null;
        }

        /**
         * @return state (string) or null if the state wasn't found
         */
        function _parseState(url) {
            var match = url.match(/\&state=(.*)*/);
            return match ? match[1] : null;
        }

        /**
         * @return {boolean}
         */
        function _isGitHubPopup() {
            if ($window.opener) {
                return Boolean($window.opener.isGitHubPopupReferer)
            } else {
                return false;
            }
        }

        /**
         * Sets a variable used to determine if the code is running in the github login popup.
         */
        function _setReferer() {
            $window.isGitHubPopupReferer = true;
        }

        /**
         * @return {string} popupUrl
         */
        function _buildPopupUrl(options) {
            return (service.GITHUB_AUTH_API_URL
                + '?client_id='
                + options.clientId
                + '&redirect_uri='
                + options.redirectUri
                + '&state='
                + options.state
                + '&scope='
                + options.scope);
        }

        /**
         * @return {object} popup
         */
        function _openPopupWindow(options) {
            service._setReferer();
            return $window.open(service._buildPopupUrl(options), '', "top=100,left=100,width=500,height=500");
        }

        /**
         * @return {string} state
         */
        function _generateState() {
            return (Math.floor((1 + Math.random()) * 0x10000)) + new Date().getTime()
                .toString(16)
                .substring(1);
        }

        /**
         * @return {string} url
         */
        function getUrl() {
            return $window.location.href;
        }

        /**
         * Continues the auth flow if the user was redirected by the github popup.
         * This function should be called when the page specified as the redirect_uri
         * is loaded.
         */
        function loginWithGitHubIfRedirectedByPopup() {
            if (service._isGitHubPopup()) {
                return $window.opener.oAuthCallbackGitHub(service._parseCode(getUrl()), service._parseState(getUrl()));
            }
        }

        /**
         * @return promise
         */
        function openPopup(options) {
            var deferred = $q.defer();
            var popup = service._openPopupWindow(options);

            $window.oAuthCallbackGitHub = function(code, state){
                if (state == service.state) {
                    popup.close();
                    deferred.resolve(code);
                } else {
                    popup.close();
                    deferred.reject('state mismatch error');
                }
            };

            return deferred.promise;
        }

        return service;
    }

})();
