(function() {
    'use strict';

    angular
        .module('qorDash.docker', [
            'ui.router',
            'qorDash.docker.domain',
            'dockerui'
        ])
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$qorSidebarProvider'];
    run.$inject = ['$rootScope', '$location', 'Settings', 'DOCKER_ENDPOINT'];

    function config($stateProvider, $qorSidebarProvider) {

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

    function run($rootScope, $location, Settings, DOCKER_ENDPOINT){
        Settings.endpoint = DOCKER_ENDPOINT;

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if (toState.name.split('.')[1]==='docker'){
                var dockerParams = $location.path().match(/docker((\/[a-z0-9.]+){1,3})/);
                if (dockerParams && dockerParams[1]) {
                    Settings.buildUrl(dockerParams[1]);
                }
            }
        });
    }

})();
