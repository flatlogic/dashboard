(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain.dockers', [
        'ui.router',
        'qorDash.docker.domain.dockers.menu'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domain.dockers', {
                url: '/:instance',
                templateUrl: 'app/modules/docker/domain/dockers/dockers.html',
                controller: 'DockersController',
                authenticate: true
            })
    }
})();
