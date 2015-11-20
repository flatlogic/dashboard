(function () {
    'use strict';

    angular
        .module('qorDash.domains.env', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.domains.domain.env', {
                url: '/:env',
                templateUrl: 'app/modules/domains/environment/environment.html',
                controller: 'DomainEnvironmentController',
                controllerAs: 'vm'
            })
    }
})();
