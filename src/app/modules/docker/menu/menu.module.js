(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu', [])
        .config(appConfig);

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu', {
                url: '/:dockerId',
                templateUrl: 'app/modules/docker/menu/menu.html',
                controller: 'DockerMenuController',
                controllerAs: 'vm',
                authenticate: true
            })
    }
})();
