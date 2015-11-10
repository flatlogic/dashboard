(function() {
    'use strict';

    angular
        .module('qorDash.auth')
        .factory('githubOauth', githubOauth);

    function githubOauth($q, $window) {
        var service = {
            loginWithGitHubIfRedirectedByPopup : loginWithGitHubIfRedirectedByPopup,
            openPopup                          : openPopup,
            GITHUB_AUTH_API_URL                : 'https://github.com/login/oauth/authorize',
            _openPopupWindow                   : _openPopupWindow,
            _buildPopupUrl                     : _buildPopupUrl,
            _setReferer                        : _setReferer,
            _isGitHubPopup                     : _isGitHubPopup,
            _parseCode                         : _parseCode
        };

        /**
         * @return code (string) or null if the code wasn't found
         */
        function _parseCode() {
            var match = $window.location.href.match(/\?code=(.*)&state/);

            return (match) ? match[1] : null;
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
         * Continues the auth flow if the user was redirected by the github popup.
         * This function should be called when the page specified as the redirect_uri
         * is loaded.
         */
        function loginWithGitHubIfRedirectedByPopup() {
            if (service._isGitHubPopup()) {
                $window.opener.oAuthCallbackGitHub(service._parseCode());
            }
        }

        /**
         * @return promise
         */
        function openPopup(options) {
            var deferred = $q.defer();
            var popup = service._openPopupWindow(options);

            $window.oAuthCallbackGitHub = function(code){
                popup.close();
                deferred.resolve(code);
            };

            return deferred.promise;
        }

        return service;
    }

})();
