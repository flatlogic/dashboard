(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.docker.domains.domain.dockers', {
                url: '/:instance',
                templateUrl: 'app/modules/docker/dockers/dockers.html',
                controller: 'DockersController',
                controllerAs: 'vm',
                resolve: {
                    resolvedDockers: function(domainService, $stateParams) {
                        return domainService.loadDockers($stateParams.domain, $stateParams.instance);
                    }
                }
            })
    }
})();
