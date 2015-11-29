(function () {
    'use strict';

    angular
        .module('qorDash.auth')
        .service('user', userService);

    function userService($http, AUTH_API_URL, auth, permissions) {
        return {
            isAuthed: isAuthed,
            logout: logout,
            login: login
        };

        function isAuthed() {
            var token = auth.getParsedToken();
            // Check token and token expiration and return true/false
            return Boolean(token && (Math.round(new Date().getTime() / 1000) <= token.exp));
        }

        function login(username, password) {
            var data = {
                username: username,
                password: password
            };

            return $http
                .post(AUTH_API_URL + '/auth', data)
                .then(auth.saveToken)
                .then(permissions.save);
        }

        function logout() {
            // TODO: Implement oauth logout
            auth.removeToken();
            permissions.clear();
        }
    }
})();
