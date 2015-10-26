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
                controllerAs: 'vm',
                resolve: {
                    resolvedContainers: function(Container, Settings) {
                        return Container.query(angular.extend({all: 1}, Settings.urlParams)).$promise;
                    },
                    resolvedImages: function(Image, Settings) {
                        return Image.query(Settings.urlParams).$promise;
                    }
                },
                authenticate: true
            })
    }
})();
