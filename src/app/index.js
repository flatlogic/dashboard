(function () {
    'use strict';

    var coreApplication = angular.module('qorDash', [
        'qorDash.core',
        'qorDash.auth',
        'qorDash.dashboard',
        'qorDash.domains',
        'qorDash.deployment',
        'qorDash.compose',
        'qorDash.configurations',
        'qorDash.orchestrate',
        'qorDash.manage'
    ]);

    fetchCoreData().then(bootstrapApplication);

    function fetchCoreData() {
        var initInjector = angular.injector(["ng"]);
        var $http = initInjector.get("$http");

        return $http.get("data/global-config.json").then(function(response) {
            var authApiUrl = response.data['auth-url'],
                apiUrl = response.data['api-url'],
                wsUrl = response.data['ws-url'],
                iconUrl = response.data['icon-url'],
                loginPageIconUrl = response.data['login-page-icon-url'];

            coreApplication.constant("AUTH_API_URL", authApiUrl);
            coreApplication.constant("API_URL", apiUrl);
            coreApplication.constant("WS_URL", wsUrl);
            coreApplication.constant("ICON_URL", iconUrl);
            coreApplication.constant("LOGIN_PAGE_ICON_URL", loginPageIconUrl);
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
