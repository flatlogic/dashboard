(function() {
    'use strict';

    angular.module('qorDash.configurations');

    servicesController.$inject = ['$scope', '$stateParams'];
    function servicesController($scope, $stateParams) {
        $scope.domain = $scope.domains.filter(function (domain) {
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
