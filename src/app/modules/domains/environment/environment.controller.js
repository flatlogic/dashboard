(function () {
    'use strict';

    angular
        .module('qorDash.domains')
        .controller('DomainEnvironmentController', domainEnvironmentController);

    function domainEnvironmentController($scope, $stateParams, WS_URL) {
        $scope.environment = {};
        $scope.domain = $stateParams.domain;
        $scope.environment.name = $stateParams.env;
        $scope.eventsWsUrl = WS_URL + '/v1/events';
        $scope.setNetworkData = function (networkData) {
            $scope.networkData = networkData;
        }
    }
})();
