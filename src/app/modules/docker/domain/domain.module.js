(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain', {
                url: '/:domain',
                templateUrl: 'app/modules/docker/domain/domain.html',
                controller: 'DockerDomainController',
                authenticate: true,
                controllerAs: 'vm',
                resolve: {
                    resolvedDomain: function(dockerService, $stateParams) {
                        return dockerService.loadDomain($stateParams.domain);
                    }
                }
            })
    }
})();
