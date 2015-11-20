(function () {

    angular
        .module('qorDash.api')
        .factory('manageLoader', manageLoader);

    function manageLoader ($q, $http, AUTH_API_URL, AUTH_API_USER, AUTH_API_SECRET, errorHandler) {
        return {
            load : load
        };

        function load() {
            var request = {
                method: 'POST',
                url: AUTH_API_URL + '/auth',
                data: {
                    'username': AUTH_API_USER,
                    'password': AUTH_API_SECRET
                }
            };

            return $http(request)
                .then(function(response) {
                    return response.data.token;
                })
                .catch(function(response) {
                    errorHandler.showError(response);
                    return $q.reject(response.data ? response.data : response);
                });
        }
    }
})();
