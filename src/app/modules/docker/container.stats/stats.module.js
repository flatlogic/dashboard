(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain.dockers.menu.containers.container.stats', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domain.dockers.menu.containers.container.stats', {
                url: '/stats',
                templateUrl: 'app/modules/docker/container.stats/stats.html',
                controller: 'DockerContainerStatsController'
            })
    }
})();
