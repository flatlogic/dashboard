(function () {
    'use strict';

    angular
        .module('qorDash.manage.settings.authentication.domain', [
            'ui.router', 'xeditable'
        ]).config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.manage.settings.authentication.domain', {
                url: '/:authDomain',
                templateUrl: 'app/modules/manage/settings/authentication/domain/domain.html',
                controller: 'AuthenticationDomainController',
                controllerAs: 'vm'
            });
    }
})();
