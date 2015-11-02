(function () {
    'use strict';

    function domainsNetworkController($scope, $timeout, networkViewService) {
        var vm = this;

        networkViewService.load()
            .then(function (response) {
                $timeout(function() {
                    $scope.$apply(function() {
                        vm.networkData = response.data;
                    });
                });
            });
    }

    angular.module('qorDash.domains')
        .controller('DomainsNetworkController', domainsNetworkController);
})();
