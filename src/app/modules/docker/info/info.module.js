(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.info', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu.info', {
                url: '/info',
                templateUrl: 'app/modules/docker/info/info.html',
                controller: 'DockerInfoController',
                controllerAs: 'vm',
                resolve: {
                    resolvedDockerInfo: function(Docker, Settings) {
                        return Docker.get(Settings.urlParams).$promise;
                    },
                    resolvedSystemInfo: function(System, Settings) {
                        return System.get(Settings.urlParams).$promise;
                    }
                }
            })
    }
})();
