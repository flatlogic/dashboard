(function () {

    angular.module('qorDash.loaders')
        .service('domainInstancesLoader', domainInstancesLoaderService);

    domainInstancesLoaderService.$inject = ['$http', 'API_URL'];
    function domainInstancesLoaderService ($http, API_URL) {
        return {
            load : function(domainId) {
                return $http.get(API_URL + '/v1/domain/' + domainId);
            }
        }
    }
})();
