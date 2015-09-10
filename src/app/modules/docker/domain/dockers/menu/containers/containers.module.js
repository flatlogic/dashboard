(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain.dockers.menu.containers', [
        'ui.router',
        'qorDash.docker.domain.dockers.menu.containers.container'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domain.dockers.menu.containers', {
                url: '/containers',
                templateUrl: 'app/modules/docker/domain/dockers/menu/containers/containers.html',
                controller: 'ContainersController',
                authenticate: true
            })
    }
})();
