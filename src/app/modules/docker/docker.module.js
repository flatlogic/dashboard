(function () {
    'use strict';

    var module = angular.module('qorDash.docker', [
        'ui.router',
        'qorDash.docker.domain',
        'dockerui'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider', '$qorSidebarProvider'];

    function appConfig($stateProvider, $qorSidebarProvider) {
        $stateProvider
            .state('app.docker', {
                url: '/docker',
                views: {
                    'main@': {
                        templateUrl: 'app/modules/docker/docker.html',
                        controller: 'DockerController'
                    }
                },
                authenticate: true
            });

        $qorSidebarProvider.config('docker', {
            title: 'Docker',
            nav: 3,
            content: '<span ui-sref="app.docker" qor-sidebar-group-heading="Docker" data-icon-class="fa fa-docker"></span>'
        });
    }
})();
