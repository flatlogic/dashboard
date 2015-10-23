(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.info.events', ['ngOboe'])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu.info.events', {
                url: '/events',
                templateUrl: 'app/modules/docker/info.events/events.html',
                controller: 'DockerInfoEventsController',
                controllerAs: 'vm'
            })
    }
})();
