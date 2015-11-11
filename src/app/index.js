(function () {
    'use strict';

    var coreApplication = angular.module('qorDash', [
        'ui.router',
        'chart.js',
        'qorDash.loaders',
        'qorDash.core',
        'qorDash.auth',
        'qorDash.dashboard',
        'qorDash.domains',
        'qorDash.deployment',
        'qorDash.compose',
        'qorDash.configurations',
        'qorDash.orchestrate',
        'qorDash.manage',
        'qorDash.docker'
    ])
    .config(function($httpProvider){
        $httpProvider.defaults.headers.post['Content-Type'] =  'application/json';
    });

    fetchCoreData().then(bootstrapApplication);

    function fetchCoreData() {
        var initInjector = angular.injector(["ng"]);
        var $http = initInjector.get("$http");

        return $http.get("data/global-config.json").then(function(response) {
            var authApiUrl = response.data['auth-url'],
                apiUrl = response.data['api-url'],
                wsUrl = response.data['ws-url'],
                iconUrl = response.data['icon-url'],
                loginPageIconUrl = response.data['login-page-icon-url'],
                authApiUser = response.data['auth_api_user'],
                authApiSecret = response.data['auth_api_secret'],
                googleClentId = response.data['google_client_id'],
                githubClientId = response.data['github_client_id'];

            coreApplication.constant("AUTH_API_URL", authApiUrl);
            coreApplication.constant("API_URL", apiUrl);
            coreApplication.constant("WS_URL", wsUrl);
            coreApplication.constant("ICON_URL", iconUrl);
            coreApplication.constant("LOGIN_PAGE_ICON_URL", loginPageIconUrl);
            coreApplication.constant("AUTH_API_USER", authApiUser);
            coreApplication.constant("DOCKER_ENDPOINT", apiUrl + '/v1/dockerapi');
            coreApplication.constant("AUTH_API_SECRET", authApiSecret);
            coreApplication.constant("GOOGLE_CLIENT_ID", googleClentId);
            coreApplication.constant("GITHUB_CLIENT_ID", githubClientId);
        }, function(errorResponse) {
            debugger;
            // Handle error case
        });
    }

    function bootstrapApplication() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ["qorDash"]);
        });
    }
})();
