(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.images', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu.images', {
                url: '/images',
                templateUrl: 'app/modules/docker/images/images.html',
                controller: 'DockerImagesController',
                controllerAs: 'vm',
                resolve: {
                    resolvedDockerImages: function(Image, Settings) {
                        return Image.query(Settings.urlParams).$promise;
                    }
                }
            })
    }
})();
