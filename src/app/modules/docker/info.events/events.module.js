(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain.dockers.menu.info.events', [
        'ui.router',
        'ngOboe'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu.info.events', {
                url: '/events',
                templateUrl: 'app/modules/docker/info.events/events.html',
                controller: 'DockerInfoEventsController'
            })
    }
})();
