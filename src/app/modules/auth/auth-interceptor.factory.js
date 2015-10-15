(function () {
    'use strict';

    angular.module('qorDash.auth')
        .factory('authInterceptor', authInterceptor);

    // Http interceptor for attaching token to headers
    authInterceptor.$inject = ['auth'];
    function authInterceptor(auth) {
        return {
            request: request,
            response: response
        };

        // automatically attach Authorization header
        function request(config) {
            var token = auth.getToken();
            if (token && !config.headers.Authorization) {
                config.headers.Authorization = 'Bearer ' + token;
            }

            config.headers.Accept = "application/json";

            return config;
        }

        function response(response) {
            return response;
        }
    }
})();