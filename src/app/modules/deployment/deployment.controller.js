(function () {
    'use strict';

    angular
        .module('qorDash.deployment')
        .controller('DeploymentController', deploymentController);

    function deploymentController($scope, $rootScope, $location, WS_URL) {
        $scope.wsTimelineUrl = WS_URL + '/v1/ws/run/timeline1';
    }

})();
