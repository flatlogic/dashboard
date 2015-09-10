(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain.dockers.menu', [
        'ui.router',
        'qorDash.docker.domain.dockers.menu.containers'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domain.dockers.menu', {
                url: '/:dockerId',
                templateUrl: 'app/modules/docker/domain/dockers/menu/menu.html',
                controller: 'DockerMenuController',
                authenticate: true
            })
    }
})();
