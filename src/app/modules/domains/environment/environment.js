(function() {
    'use strict';

    domainEnvironmentController.$inject = ['$scope', '$stateParams'];
    function domainEnvironmentController($scope, $stateParams) {
        $scope.environment = {};
        $scope.environment.name = $stateParams.env;
        $scope.setNetworkData = function(networkData) {
            $scope.networkData = networkData;
        }
    }

    angular.module('qorDash.domains')
        .controller('DomainEnvironmentController', domainEnvironmentController);
})();
