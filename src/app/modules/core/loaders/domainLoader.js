(function () {

    angular.module('qorDash.loaders')
        .factory('domainLoader', domainLoaderService);

    domainLoaderService.$inject = ['$http', 'API_URL'];
    function domainLoaderService ($http, API_URL) {
        return {
            load : load
        };

        function load(domainId) {
            return $http.get(API_URL + '/v1/domain/' + domainId);
        }
    }
})();
