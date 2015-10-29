(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.containers.container.logs', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu.containers.container.logs', {
                url: '/logs',
                templateUrl: 'app/modules/docker/container.logs/logs.html',
                controller: 'DockerContainerLogsController',
                controllerAs: 'vm',
                resolve: {
                    resolvedContainer: function(Container, Settings, $stateParams) {
                        var urlParams = angular.extend({id: $stateParams.containerId}, Settings.urlParams);
                        return Container.get(urlParams).$promise;
                    },
                    resolvedContainerLogsStdout: function(dockerService, $stateParams) {
                        return dockerService.getContainerLogs($stateParams.containerId, {
                            stdout: 1,
                            stderr: 0
                        });
                    },
                    resolvedContainerLogsStderr: function(dockerService, $stateParams) {
                        return dockerService.getContainerLogs($stateParams.containerId, {
                            stdout: 0,
                            stderr: 1
                        });
                    }
                },
                authenticate: true
            })
    }
})();
