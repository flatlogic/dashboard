(function() {
    'use strict';

    angular.module('qorDash.domains')
        .controller('DomainsSidebarController', DomainsSidebarController)
        .value('domains', [
            {"id":"api.foo.com", "name":"Api", "url":"https://server.com/domain/api.foo.com" },
            {"id":"portal.foo.com", "name": "Portal", "url":"https://server.com/domain/portal.foo.com"}
        ])
    ;

    DomainsSidebarController.$inject = ['$scope', 'domains'];
    function DomainsSidebarController($scope, domains) {
        $scope.domains = domains;
    }

    var domainsController = angular.createAuthorizedController('DomainsController', ['$scope', '$stateParams', 'domains', function($scope, $stateParams, domains) {
        $scope.domain = domains.filter(function(domain){
            return domain.id == $stateParams.id;
        })[0];


        var subs = {
            "api.foo.com": [
                {
                    "id" : "development.api.foo.com",
                    "name": "development"
                },
                {
                    "id" : "staging.api.foo.com",
                    "name": "staging"
                },
                {
                    "id" : "production.api.foo.com",
                    "name": "production"
                }
            ],
            "portal.foo.com": [
                {
                    "id" : "development.portal.foo.com",
                    "name": "development"
                },
                {
                    "id" : "staging.portal.foo.com",
                    "name": "staging"
                }
            ]
        };
        if (!$scope.environments) {
            $scope.environments = subs[$stateParams.id];
        }
    }]);

    var domainEnvironmentController = angular.createAuthorizedController('DomainEnvironmentController', ['$scope', '$stateParams', function($scope, $stateParams) {
        $scope.environment = {};
        $scope.environment.name = $stateParams.env;
        $scope.setNetworkData = function(networkData) {
            $scope.networkData = networkData;
        }
    }]);

    var domainNodeController = angular.createAuthorizedController('DomainNodeController', ['$scope', '$stateParams', function($scope, $stateParams) {
        $scope.$watch('networkData', function(networkData) {
            if (!networkData) return;
            $scope.node = findNode(networkData, $stateParams.node, parseInt($stateParams.depth));
        });

        function findNode(currentNode, name, depth) {
            var _depth = -1;
            return findNodeInner(currentNode, name, depth);
            function findNodeInner(currentNode, name, depth) {
                var i, currentChild, result;
                _depth++;
                if (name == currentNode.name && (depth == _depth)) {
                    return currentNode;
                } else if (currentNode.children) {
                    for (i = 0; i < currentNode.children.length; i++) {
                        currentChild = currentNode.children[i];
                        result = findNodeInner(currentChild, name, depth);
                        _depth--;
                        if (result) {
                            return result;
                        }
                    }
                } else {
                    return void 0;
                }
            }
        }
    }]);

    angular.module('qorDash.domains')
        .controller(domainsController)
        .controller(domainEnvironmentController)
        .controller(domainNodeController);
})();
