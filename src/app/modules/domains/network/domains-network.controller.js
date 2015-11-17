(function () {
    'use strict';

    angular
        .module('qorDash.domains')
        .controller('DomainsNetworkController', domainsNetworkController);

    function domainsNetworkController($scope, $timeout, networkViewService, $state, resolvedNetworkData) {
        var vm = this;

        vm.showDetails = showDetails;
        vm.networkData = resolvedNetworkData;

        networkViewService.load()
            .then(function (response) {
                $timeout(function() {
                    $scope.$apply(function() {
                        vm.networkData = response.data;
                    });
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
