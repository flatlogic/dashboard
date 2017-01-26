(function () {
    'use strict';

    angular
        .module('qorDash.auth')
        .service('user', userService);

    function userService($http, AUTH_API_URL, $q, auth, permissions) {
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

            var deferred = $q.defer();

            var result = deferred.promise
                .then(auth.saveToken)
                .then(permissions.save);

            deferred.resolve({
                data: {
                    token: 'blah'
                }
            });

            return result;
        }

        function logout() {
            // TODO: Implement oauth logout
            auth.removeToken();
            permissions.clear();
        }
    }
})();
