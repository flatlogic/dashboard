(function () {

    angular
        .module('qorDash.loaders')
        .factory('orchestrateService', orchestrateService);

    function orchestrateService ($http, API_HOST) {
        return {
            loadHistory : loadHistory,
            loadInstances: loadInstances,
            loadOption: loadOption,
            loadLogUrl: loadLogUrl
        };

        function httpRequestSuccess(response) {
            return response.data;
        }

        function httpRequestFailed(response) {
            errorHandler.showError(response);
            return $q.reject(response.data ? response.data : response);
        }

        function loadHistory(domain, instance, option) {
            return $http
                .get(API_HOST + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/')
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function loadInstances(domain, instance) {
            return $http
                .get(API_HOST + '/v1/orchestrate/'+ domain +'/'+ instance +'/')
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);;
        }

        function loadOption(domain, instance, option, optionId) {
            return $http.get(API_HOST + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/' + optionId)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function loadLogUrl(activateUrl, data) {
            var request = {
                method: 'POST',
                url: API_HOST + activateUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }
    }
})();
