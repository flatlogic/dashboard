(function() {
    'use strict';

    angular
        .module('qorDash.docker', [
            'ngOboe',
            'dockerui',
            'qorDash.docker',
            'qorDash.docker.domain',
            'qorDash.docker.domain.dockers',
            'qorDash.docker.domain.dockers.menu',
            'qorDash.docker.domain.dockers.menu.summary',
            'qorDash.docker.domain.dockers.menu.containers',
            'qorDash.docker.domain.dockers.menu.containers.container',
            'qorDash.docker.domain.dockers.menu.containers.container.top',
            'qorDash.docker.domain.dockers.menu.containers.container.logs',
            'qorDash.docker.domain.dockers.menu.containers.container.stats',
            'qorDash.docker.domain.dockers.menu.images',
            'qorDash.docker.domain.dockers.menu.images.image',
            'qorDash.docker.domain.dockers.menu.info',
            'qorDash.docker.domain.dockers.menu.info.events'
        ])
        .config(config)
        .run(run);

    function config($stateProvider, $qorSidebarProvider) {

        $stateProvider
            .state('app.docker', {
                url: '/docker',
                views: {
                    'main@': {
                        template: '<div ui-view=""></div>',
                        controller:function($state) {
                            var currentState = $state.current.name;
                            var stateTo = currentState === 'app.docker' ? 'app.docker.domains' : currentState;
                            $state.go(stateTo);
                        }
                    }
                }
            })
            .state('app.docker.domains', {
                url: '',
                templateUrl: 'app/modules/docker/docker.html',
                controller: 'DockerController',
                controllerAs: 'vm',
                resolve: {
                    resolvedDomains: function(domainService) {
                        return domainService.loadDomains();
                    }
                }
            });

        $qorSidebarProvider.config('docker', {
            title: 'Docker',
            nav: 3,
            content: '<span ui-sref="app.docker" qor-sidebar-group-heading="Docker" data-icon-class="fa fa-docker"></span>'
        });
    }

    function run($rootScope, $state, Settings, DOCKER_ENDPOINT){
        Settings.endpoint = DOCKER_ENDPOINT;

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            var url = $state.href(toState, toParams);
            if (toState.name.split('.')[1]==='docker'){
                var dockerParams = url.match(/docker((\/[a-z0-9.]+){1,3})/);
                if (dockerParams && dockerParams[1]) {
                    Settings.buildUrl(dockerParams[1]);
                }
            }
        });
    }

})();
