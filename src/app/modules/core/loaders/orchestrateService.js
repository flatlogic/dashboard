(function () {

    angular.module('qorDash.loaders')
        .service('orchestrateService', orchestrateService);

    orchestrateService.$inject = ['$http', 'API_URL'];
    function orchestrateService ($http, API_URL) {
        return {
            loadHistory : function(domain, instance, option) {
                return $http.get(API_URL + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/');
            },
            loadInstances: function(domain, instance) {
                return $http.get(API_URL + '/v1/orchestrate/'+ domain +'/'+ instance +'/');
            },
            loadOption: function(domain, instance, option, optionId) {
                return $http.get(API_URL + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/' + optionId);
            },
            loadLogUrl: function(activateUrl, data) {
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
    }
})();
