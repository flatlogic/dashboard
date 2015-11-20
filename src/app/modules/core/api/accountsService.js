(function () {

    angular
        .module('qorDash.api')
        .factory('accountsService', accountsService);

    function accountsService ($http, AUTH_API_URL, errorHandler, $q) {
        return {
            getAccounts : getAccounts,
            getAccountById : getAccountById,
            createAccount : createAccount,
            createGoogleAccount : createGoogleAccount,
            createGitHubAccount : createGitHubAccount
        };

        function httpRequestSuccess(response) {
            return response.data || response;
        }

        function httpRequestFailed(response) {
            errorHandler.showError(response);
            return response.data || response;
        }

        function getAccounts(token){
            var request = {
                method: 'GET',
                url: AUTH_API_URL + '/account/',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };
            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function getAccountById(accountId, token) {
            var request = {
                method: 'GET',
                url: AUTH_API_URL + '/account/' + accountId,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };
            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function createGoogleAccount(username, email, token) {
            var request = {
                method: 'POST',
                url: AUTH_API_URL + '/register',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    "identity": {
                        "username": username,
                        "oauth2_provider" :"google.com",
                        "oauth2_account_id" : email
                    }
                }
            };

            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function createGitHubAccount(username, githubUsername, token) {
            var request = {
                method: 'POST',
                url: AUTH_API_URL + '/register',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    "identity": {
                        "username": username,
                        "oauth2_provider" :"github.com",
                        "oauth2_account_id" : githubUsername
                    }
                }
            };

            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function createAccount(username, password, custom_object, token) {
            var request = {
                method: 'POST',
                url: AUTH_API_URL + '/register',
                headers: {
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

            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }
    }
})();
