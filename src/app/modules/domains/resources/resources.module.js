(function () {
    'use strict';

    angular
        .module('qorDash.domains.env.resources', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.domains.domain.env.resources', {
                url: '/resources',
                templateUrl: 'app/modules/domains/resources/resources.html',
                authenticate: true
            });
    }
})();
