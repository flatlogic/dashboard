(function () {

    angular
        .module('qorDash.api')
        .factory('authenticationService', authenticationService);

    function authenticationService ($http, AUTH_API_URL, errorHandler, $q) {
        return {
            getDomains : getDomains,
            getDomainInfo: getDomainInfo,
            saveDomainInfo: saveDomainInfo
        };

        function httpRequestSuccess(response) {
            return response.data ? response.data : response;
        }

        function httpRequestFailed(response) {
            errorHandler.showError(response);
            return $q.reject(response.data ? response.data : response);
        }

        function getDomains(token) {
            var request = {
                method: 'GET',
                url: AUTH_API_URL + '/admin/domain/',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };
            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function getDomainInfo(domainId, token) {
            var request = {
                method: 'GET',
                url: AUTH_API_URL + '/admin/domain/' + domainId,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };
            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function saveDomainInfo(domainId, data, token) {
            var request = {
                method: 'POST',
                url: AUTH_API_URL + '/admin/domain/' + domainId,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: data
            };
            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }
    }
})();
