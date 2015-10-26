(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.containers.container.top', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu.containers.container.top', {
                url: '/top',
                templateUrl: 'app/modules/docker/container.top/top.html',
                controller: 'DockerContainerTopController',
                controllerAs: 'vm',
                resolve: {
                    resolvedContainerTop: function(dockerService, $stateParams) {
                        return dockerService.getContainerTop($stateParams.containerId);
                    }
                }
            })
    }
})();
