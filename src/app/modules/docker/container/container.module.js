(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain.dockers.menu.containers.container', [
        'ui.router',
        'qorDash.docker.domain.dockers.menu.containers.container.logs',
        'qorDash.docker.domain.dockers.menu.containers.container.stats',
        'qorDash.docker.domain.dockers.menu.containers.container.top'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu.containers.container', {
                url: '/:containerId',
                templateUrl: 'app/modules/docker/container/container.html',
                controller: 'ContainerController',
                authenticate: true
            })
    }
})();
