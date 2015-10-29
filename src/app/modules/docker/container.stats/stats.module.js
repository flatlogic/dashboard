(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.containers.container.stats', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu.containers.container.stats', {
                url: '/stats',
                templateUrl: 'app/modules/docker/container.stats/stats.html',
                controller: 'DockerContainerStatsController',
                controllerAs: 'vm'
            })
    }
})();
