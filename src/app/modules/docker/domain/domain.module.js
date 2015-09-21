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
                url: '/:domain',
                templateUrl: 'app/modules/docker/domain/domain.html',
                controller: 'DockerDomainController',
                authenticate: true
            })
    }
})();
