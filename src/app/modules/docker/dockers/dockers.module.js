(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers', {
                url: '/:instance',
                authenticate: true,
                templateUrl: 'app/modules/docker/dockers/dockers.html',
                controller: 'DockersController',
                controllerAs: 'vm',
                resolve: {
                    resolvedDockers: function(dockerService, $stateParams) {
                        return dockerService.loadDockers($stateParams.domain, $stateParams.instance);
                    }
                }
            })
    }
})();
