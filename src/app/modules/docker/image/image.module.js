(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.images.image', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers.menu.images.image', {
                url: '/:imageId/:imageTag',
                templateUrl: 'app/modules/docker/image/image.html',
                controller: 'DockerImageController',
                controllerAs: 'vm',
                resolve: {
                    resolvedDockerImage: function(Image, Settings, $stateParams) {
                        var urlParams = angular.extend({id: $stateParams.imageId}, Settings.urlParams);
                        return Image.get(urlParams).$promise;
                    },
                    resolvedDockerImageHistory: function(Image, Settings, $stateParams) {
                        var urlParams = angular.extend({id: $stateParams.imageId}, Settings.urlParams);
                        return Image.history(urlParams).$promise;
                    }
                }
            })
    }
})();
