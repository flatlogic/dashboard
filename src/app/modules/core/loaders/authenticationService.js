(function () {

    angular.module('qorDash.loaders')
        .factory('authenticationService', authenticationService);

    authenticationService.$inject = ['$http', 'AUTH_API_URL'];
    function authenticationService ($http, AUTH_API_URL) {
        return {
            getDomains : getDomains,
            getDomainInfo: getDomainInfo,
            saveDomainInfo: saveDomainInfo
        };

        function getDomains(token) {
            var request = {
                method: 'GET',
                url: AUTH_API_URL + '/admin/domain/',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            };
            return $http(request);
        }

        function getDomainInfo(domainId, token) {
            var request = {
                method: 'GET',
                url: AUTH_API_URL + '/admin/domain/' + domainId,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            };
            return $http(request);
        }

        function saveDomainInfo(domainId, data, token) {
            var request = {
                method: 'POST',
                url: AUTH_API_URL + '/admin/domain/' + domainId,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                data: data
            };
            return $http(request);
        }
    }
})();
