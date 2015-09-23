(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain.dockers.menu.containers.container.top', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domain.dockers.menu.containers.container.top', {
                url: '/top',
                templateUrl: 'app/modules/docker/domain/dockers/menu/containers/container/top/top.html',
                controller: 'DockerContainerTopController'
            })
    }
})();
