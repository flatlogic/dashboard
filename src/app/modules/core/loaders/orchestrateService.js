(function () {

    angular
        .module('qorDash.loaders')
        .factory('orchestrateService', orchestrateService);

    orchestrateService.$inject = ['$http', 'API_URL'];
    function orchestrateService ($http, API_URL) {
        return {
            loadHistory : loadHistory,
            loadInstances: loadInstances,
            loadOption: loadOption,
            loadLogUrl: loadLogUrl
        };

        function loadHistory(domain, instance, option) {
            return $http.get(API_URL + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/');
        }

        function loadInstances(domain, instance) {
            return $http.get(API_URL + '/v1/orchestrate/'+ domain +'/'+ instance +'/');
        }

        function loadOption(domain, instance, option, optionId) {
            return $http.get(API_URL + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/' + optionId);
        }

        function loadLogUrl(activateUrl, data) {
            var request = {
                method: 'POST',
                url: API_URL + activateUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            return $http(request);
        }
    }
})();
