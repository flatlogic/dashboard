(function () {
    'use strict';

    angular
        .module('qorDash.manage.settings.authentication', [
            'qorDash.manage.settings.authentication.domain'
        ])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.manage.settings.authentication', {
                url: '/authentication',
                templateUrl: 'app/modules/manage/settings/authentication/authentication.html',
                controller: 'AuthenticationSettingsController',
                controllerAs: 'vm',
                resolve: {
                    resolvedToken: function(manageLoader) {
                        return manageLoader.load();
                    },
                    resolvedDomains: function(authenticationService, resolvedToken) {
                        return authenticationService.getDomains(resolvedToken);
                    }
                }
            });
    }
})();
