(function () {

    angular.module('qorDash.loaders')
        .factory('dockerService', dockerService);

    function dockerService ($http, $q, Settings, errorHandler) {

        return {
            getContainerTop: getContainerTop
        };

        function httpRequestSuccess(response) {
            return response.data ? response.data : response;
        }

        function httpRequestFailed(response) {
            errorHandler.showError(response);
            return $q.reject(response.data ? response.data : response);
        }


        function getContainerTop(id, ps_args) {
            return $http({
                        method: 'GET',
                        url: Settings.url + '/containers/' + id + '/top',
                        params: {
                            ps_args: ps_args
                        }
                    })
                    .then(httpRequestSuccess)
                    .catch(httpRequestFailed);
        }

    }
})();
