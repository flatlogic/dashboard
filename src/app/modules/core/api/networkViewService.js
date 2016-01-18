(function () {

    angular
        .module('qorDash.api')
        .factory('networkViewService', networkViewService);

    function networkViewService ($http, errorHandler) {
        return {
            load : load
        };

        function load(url) {
            return $http.get(url)
                .then(function(response) {
                    return response.data ? response.data : response;
                })
                .catch(function(error) {
                    errorHandler.showError(error);
                    return $q.reject(error.data ? error.data : error);
                });
        }
    }
})();
