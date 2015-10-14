(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain.dockers.menu.images', [
        'ui.router',
        'qorDash.docker.domain.dockers.menu.images.image'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu.images', {
                url: '/images',
                templateUrl: 'app/modules/docker/images/images.html',
                controller: 'DockerImagesController',
                authenticate: true
            })
    }
})();
