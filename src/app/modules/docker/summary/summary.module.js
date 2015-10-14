(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain.dockers.menu.summary', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu.summary', {
                url: '/summary',
                templateUrl: 'app/modules/docker/summary/summary.html',
                controller: 'DockerSummaryController',
                authenticate: true
            })
    }
})();
