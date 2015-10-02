(function () {

    angular.module('qorDash.loaders')
        .service('domainsLoader', domainsLoaderService);

    domainsLoaderService.$inject = ['$http', 'API_URL'];
    function domainsLoaderService ($http, API_URL) {
        return {
            load : function() {
                return $http.get(API_URL + '/v1/domain/');
            }
        }
    }
})();
