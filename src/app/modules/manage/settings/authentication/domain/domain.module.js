(function () {
    'use strict';

    angular
        .module('qorDash.manage.settings.authentication.domain', [
            'xeditable'
        ])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.manage.settings.authentication.domain', {
                url: '/:authDomain',
                templateUrl: 'app/modules/manage/settings/authentication/domain/domain.html',
                controller: 'AuthenticationDomainController',
                controllerAs: 'vm',
                resolve: {
                    resolvedToken: function(manageLoader) {
                        return manageLoader.load();
                    },
                    resolvedDomain: function(authenticationService, resolvedToken, $stateParams) {
                        return authenticationService.getDomainInfo($stateParams.authDomain, resolvedToken);
                    }
                }
            });
    }
})();
