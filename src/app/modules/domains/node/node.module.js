(function () {
    'use strict';

    angular
        .module('qorDash.domains.env.network.node', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.domains.domain.env.network.node', {
                url: '/:depth/:node',
                templateUrl: 'app/modules/domains/node/node.html',
                controller: 'DomainNodeController',
                controllerAs: 'vm'
            })
    }
})();
