(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.containers', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu.containers', {
                url: '/containers',
                templateUrl: 'app/modules/docker/containers/containers.html',
                controller: 'ContainersController',
                controllerAs: 'vm',
                resolve: {
                    resolveContainers: function(Container, Settings) {
                        var urlParams = Settings.urlParams;
                        return Container.query(urlParams).$promise;
                    }
                }
            })
    }
})();
