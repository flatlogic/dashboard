(function () {

    angular.module('qorDash.loaders')
        .service('manageLoader', manageLoader);

    manageLoader.$inject = ['$q', '$http', 'AUTH_API_URL', 'AUTH_API_USER', 'AUTH_API_SECRET'];
    function manageLoader ($q, $http, AUTH_API_URL, AUTH_API_USER, AUTH_API_SECRET) {
        return {
            load : function() {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: AUTH_API_URL + '/auth',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        'username': AUTH_API_USER,
                        'password': AUTH_API_SECRET
                    }
                }).then(function(response) {
                    deferred.resolve(response.data.token)
                }, function(response) {
                    deferred.reject();
                });

                return deferred.promise;
            }
        }
    }
})();
