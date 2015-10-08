(function () {

    angular.module('qorDash.loaders')
        .service('authenticationService', authenticationService);

    authenticationService.$inject = ['$http', 'AUTH_API_URL'];
    function authenticationService ($http, AUTH_API_URL) {
        return {
            getDomains : function(token) {
                var request = {
                    method: 'GET',
                    url: AUTH_API_URL + '/admin/domain/',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                };
                return $http(request);
            },
            getDomainInfo: function(domainId, token) {
                var request = {
                    method: 'GET',
                    url: AUTH_API_URL + '/admin/domain/' + domainId,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                };
                return $http(request);
            },
            saveEdits: function(domainId, data) {

            }
        }
    }
})();
