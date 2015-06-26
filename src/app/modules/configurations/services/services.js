(function() {
    'use strict';

    angular.module('qorDash.configurations')
        .value('domains', [
            {"id":"api.foo.com", "name":"Api", "url":"https://server.com/domain/api.foo.com" },
            {"id":"portal.foo.com", "name": "Portal", "url":"https://server.com/domain/portal.foo.com"}
        ])
    ;

    servicesController.$inject = ['$scope', '$stateParams', 'domains'];
    function servicesController($scope, $stateParams, domains) {
        $scope.domain = domains.filter(function (domain) {
            return domain.id == $stateParams.domain;
        })[0];

        var subs = [
            {
                "service": "blinker",
                "instances": [ "ops-dev", "staging", "production" ],
                "versions":[ "develop", "v1.0", "v1.1" ]
            },
            {
                "service": "vdp",
                "instances": [ "ops-dev", "staging", "production" ],
                "versions":[ "v0.1", "v1.0" ]
            }
        ];

        if (!$scope.services) {
            $scope.services = subs;
        }
    }

    angular.module('qorDash.configurations')
        .controller('ServicesController', servicesController);
})();
