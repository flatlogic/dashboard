(function() {
    'use strict';

    var deploymentContoller = angular.createAuthorizedController('DeploymentController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

    }]);

    angular.module('qorDash.deployment')
        .controller(deploymentContoller);

})();
