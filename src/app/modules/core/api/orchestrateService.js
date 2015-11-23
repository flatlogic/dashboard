(function () {

    angular
        .module('qorDash.api')
        .factory('orchestrateService', orchestrateService);

    function orchestrateService ($http, API_HOST) {
        return {
            getHistory : getHistory,
            getInstances: getInstances,
            getOption: getOption,
            getLogUrl: getLogUrl
        };

        function httpRequestSuccess(response) {
            return response.data;
        }

        function httpRequestFailed(response) {
            errorHandler.showError(response);
            return $q.reject(response.data ? response.data : response);
        }

        function getHistory(domain, instance, option) {
            return $http
                .get(API_HOST + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/')
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function getInstances(domain, instance) {
            return $http
                .get(API_HOST + '/v1/orchestrate/'+ domain +'/'+ instance +'/')
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);;
        }

        function getOption(domain, instance, option, optionId) {
            return $http.get(API_HOST + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/' + optionId)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function getLogUrl(activateUrl, data) {
            var request = {
                method: 'POST',
                url: API_HOST + activateUrl,
                data: data
            };

            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }
    }
})();
