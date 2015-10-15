(function () {
    'use strict';

    angular.module('qorDash.auth')
        .service('auth', authService);

    function authService($window) {
        var self = this;

        // Key to store and access token in localstorage
        self.tokenKey = 'authToken';

        return {
            saveToken: saveToken,
            getToken: getToken,
            removeToken: removeToken,
            getParsedToken: getParsedToken
        };

        function saveToken(token) {
            $window.localStorage[self.tokenKey] = token;
        }

        function getToken() {
            return $window.localStorage[self.tokenKey];
        }

        function removeToken() {
            $window.localStorage.removeItem(self.tokenKey);
        }

        /**
         * Convert token from JWT format to an object
         * @returns {object} JSON object contains token info or empty object
         */
        function getParsedToken() {
            var token = getToken();
            if (!token) {
                return false;
            }

            // Decode from base64
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');

            return JSON.parse($window.atob(base64));
        }
    }
})();
