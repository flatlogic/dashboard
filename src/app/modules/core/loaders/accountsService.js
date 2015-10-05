(function () {

    angular.module('qorDash.loaders')
        .service('accountsService', accountsService);

    accountsService.$inject = ['$http', 'API_URL', 'AUTH_API_URL'];
    function accountsService ($http, API_URL, AUTH_API_URL) {
        return {
            getAccounts : function(token) {
                var request = {
                    method: 'GET',
                    url: AUTH_API_URL + '/account/',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                };
                return $http(request);
            },
            getAccountById : function(accountId, token) {
                var request = {
                    method: 'GET',
                    url: AUTH_API_URL + '/account/' + accountId,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                };
                return $http(request);
            },
            createAccount : function(username, password, custom_object, token) {
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
    }
})();
