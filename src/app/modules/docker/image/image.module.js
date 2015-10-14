(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain.dockers.menu.images.image', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domain.dockers.menu.images.image', {
                url: '/:imageId/:imageTag',
                templateUrl: 'app/modules/docker/image/image.html',
                controller: 'DockerImageController',
                authenticate: true
            })
    }
})();
