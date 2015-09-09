(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain', [
        'ui.router',
        'qorDash.docker.domain.dockers'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.docker.domain', {
                url: '/:id',
                templateUrl: 'app/modules/docker/domain/domain.html',
                controller: 'DockerDomainController',
                authenticate: true
            })
    }
})();
