(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain.dockers.menu.summary', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domain.dockers.menu.summary', {
                url: '/summary',
                templateUrl: 'app/modules/docker/domain/dockers/menu/summary/summary.html',
                controller: 'DockerSummaryController',
                authenticate: true
            })
    }
})();
