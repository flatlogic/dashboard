(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain.dockers.menu.info', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domain.dockers.menu.info', {
                url: '/info',
                templateUrl: 'app/modules/docker/domain/dockers/menu/info/info.html',
                controller: 'DockerInfoController',
                authenticate: true
            })
    }
})();
