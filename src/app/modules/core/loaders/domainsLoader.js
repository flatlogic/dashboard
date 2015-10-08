(function () {

    angular.module('qorDash.loaders')
        .factory('domainsLoader', domainsLoaderService);

    domainsLoaderService.$inject = ['$http', 'API_URL'];
    function domainsLoaderService ($http, API_URL) {
        return {
            load : load
        };

        function load() {
            return $http.get(API_URL + '/v1/domain/');
        }
    }
})();
