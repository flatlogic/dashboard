(function () {

    angular.module('qorDash.loaders')
        .service('domainLoader', domainLoaderService);

    domainLoaderService.$inject = ['$http', 'API_URL'];
    function domainLoaderService ($http, API_URL) {
        return {
            load : function(domainId) {
                return $http.get(API_URL + '/v1/domain/' + domainId);
            }
        }
    }
})();
