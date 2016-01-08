(function () {
    'use strict';

    angular
        .module('qorDash.domains')
        .controller('DomainsNetworkController', domainsNetworkController);

    function domainsNetworkController($scope, networkViewService, $state, resolvedNetworkData) {
        var vm = this;

        vm.showDetails = showDetails;
        vm.networkData = resolvedNetworkData;
        vm.globalChildren = [];

        $scope.$on('loadChildrenEvent', function(event, url) {
            networkViewService
                .load(url)
                .then(function(resolve) {
                    vm.globalChildren.push(resolve);
                })
                .catch(function() {

                });
        });

        function showDetails(node) {
            $state.go('app.domains.domain.env.network.node',
                {
                    depth: node.depth,
                    node: node.name
                }
            );
        }
    }
})();
