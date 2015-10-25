(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.containers.container', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu.containers.container', {
                url: '/:containerId',
                templateUrl: 'app/modules/docker/container/container.html',
                controller: 'ContainerController',
                controllerAs: 'vm',
                resolve: {
                    resolvedContainer: function(Container, Settings, $stateParams) {
                        var urlParams = angular.extend({id: $stateParams.containerId}, Settings.urlParams);
                        return Container.get(urlParams).$promise;
                    },
                    resolvedContainerChanges: function(Container, Settings, $stateParams) {
                        var urlParams = angular.extend({id: $stateParams.containerId}, Settings.urlParams);
                        return Container.changes(urlParams).$promise;
                    }
                },
                authenticate: true
            })
    }
})();
