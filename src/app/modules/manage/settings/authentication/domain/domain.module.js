(function () {
    'use strict';

    var module = angular.module('qorDash.manage.settings.authentication.domain', [
        'ui.router', 'xeditable'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.manage.settings.authentication.domain', {
                url: '/:authDomain',
                templateUrl: 'app/modules/manage/settings/authentication/domain/domain.html',
                controller: 'AuthenticationDomainController',
                controllerAs: 'vm'
            });
    }
})();
