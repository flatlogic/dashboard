(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain.dockers.menu', [
        'ui.router',
        'qorDash.docker.domain.dockers.menu.containers',
        'qorDash.docker.domain.dockers.menu.summary',
        'qorDash.docker.domain.dockers.menu.images',
        'qorDash.docker.domain.dockers.menu.info'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu', {
                url: '/:dockerId',
                templateUrl: 'app/modules/docker/menu/menu.html',
                controller: 'DockerMenuController',
                authenticate: true
            })
    }
})();
