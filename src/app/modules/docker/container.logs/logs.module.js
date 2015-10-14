(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain.dockers.menu.containers.container.logs', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu.containers.container.logs', {
                url: '/logs',
                templateUrl: 'app/modules/docker/container.logs/logs.html',
                controller: 'DockerContainerLogsController',
                authenticate: true
            })
    }
})();
