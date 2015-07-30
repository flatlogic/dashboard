(function() {
    'use strict';

    angular.module('qorDash.domains')
        .value('domains', [
            {"id":"api.foo.com", "name":"Api", "url":"https://server.com/domain/api.foo.com" },
            {"id":"blinker.com", "name": "Portal", "url":"https://server.com/domain/blinker.com"}
        ])
    ;

    domainController.$inject = ['$scope', '$stateParams', 'domains'];
    function domainController($scope, $stateParams, domains) {
        $scope.domain = domains.filter(function (domain) {
            return domain.id == $stateParams.id;
        })[0];

        var subs = {
            "api.foo.com": [
                {
                    "id": "development.api.foo.com",
                    "name": "development"
                },
                {
                    "id": "staging.api.foo.com",
                    "name": "staging"
                },
                {
                    "id": "production.api.foo.com",
                    "name": "production"
                }
            ],
            "portal.foo.com": [
                {
                    "id": "development.portal.foo.com",
                    "name": "development"
                },
                {
                    "id": "staging.portal.foo.com",
                    "name": "staging"
                }
            ]
        };
        if (!$scope.environments) {
            $scope.environments = subs[$stateParams.id];
        }
    }

    angular.module('qorDash.domains')
        .controller('DomainController', domainController);
})();
