(function () {
    'use strict';

    angular.module('qorDash.auth')
        .service('user', userService);

    function userService($http, $injector, auth, dataLoader) {
        return {
            isAuthed : isAuthed,
            getPermissions: getPermissions,
            login: login,
            hasAccessTo: hasAccessTo,
            logout: logout
        };

        function isAuthed() {
            var token = auth.getParsedToken();
            // Check token and token expiration and return true/false
            return Boolean(token && (Math.round(new Date().getTime() / 1000) <= token.exp));
        }

        // Get all user permissions in one array of strings
        function getPermissions() {
            var token = auth.getParsedToken();
            if (token) {
                return token['passport/@scopes'].split(',');
            } else {
                return [];
            }
        }

        function login(username, password) {
            var request = {
                method: 'POST',
                url: $injector.get('AUTH_API_URL') + '/auth',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    username: username,
                    password: password
                }
            };

            return $http(request).then(
                function (response) {
                    if (response.data.token) {
                        auth.saveToken(response.data.token);
                    }
                });
        }

        function hasAccessTo(itemName) {
            var currentUserPermissions = this.getPermissions();
            var globalPermissions = dataLoader.getGlobalPermissions();

            var neededPermission = globalPermissions[itemName];

            if (neededPermission) {
                return currentUserPermissions.indexOf(neededPermission) != -1;
            } else {
                return false;
            }
        }

        function logout() {
            auth.removeToken();
        }
    }
})();