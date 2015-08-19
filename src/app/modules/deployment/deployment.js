(function () {
    'use strict';

    var deploymentController = angular.createAuthorizedController('DeploymentController', ['$scope', '$rootScope', '$location', 'WS_URL', function ($scope, $rootScope, $location, WS_URL) {
        $scope.wsTimelineUrl = WS_URL + '/v1/ws/run/timeline1';
    }]);

    angular.module('qorDash.deployment')
        .controller(deploymentController);

})();
