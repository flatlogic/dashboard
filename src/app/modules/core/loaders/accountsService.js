(function () {

    angular.module('qorDash.loaders')
        .factory('accountsService', accountsService);

    accountsService.$inject = ['$http', 'AUTH_API_URL'];
    function accountsService ($http, AUTH_API_URL) {
        return {
            getAccounts : getAccounts,
            getAccountById : getAccountById,
            createAccount : createAccount
        };

        function getAccounts(token){
            var request = {
                method: 'GET',
                url: AUTH_API_URL + '/account/',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            };
            return $http(request);
        }

        function getAccountById(accountId, token) {
            var request = {
                method: 'GET',
                url: AUTH_API_URL + '/account/' + accountId,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            };
            return $http(request);
        }

        function createAccount(username, password, custom_object, token) {
            var request = {
                method: 'POST',
                url: AUTH_API_URL + '/register',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    "identity": {
                        "username": username,
                        "password": password
                    },
                    "custom_object": custom_object
                }
            };

            return $http(request);
        }
    }
})();
