(function () {

    angular.module('qorDash.loaders')
        .factory('domainService', domainService);

    function domainService ($http, $q, API_URL, errorHandler) {
        var _URL = API_URL;

        return {
            loadDomains: loadDomains,
            loadDomain: loadDomain,
            loadDockers: loadDockers
        };

        function httpRequestSuccess(response) {
            return response.data ? response.data : response;
        }

        function httpRequestFailed(response) {
            errorHandler.showError(response);
            return $q.reject(response.data ? response.data : response);
        }

        function loadDomains() {
            return $http
                .get(_URL + '/v1/domain/')
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function loadDomain(domainId) {
            return $http
                .get(_URL + '/v1/domain/' + domainId)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function loadDockers(domainId, instance) {
            return $http
                .get(_URL + '/v1/dockerapi/' + domainId + '/' + instance + '/')
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

    }
})();
