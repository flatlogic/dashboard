(function() {
    'use strict';

    var deploymentController = angular.createAuthorizedController('DeploymentController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

    }]);

    angular.module('qorDash.deployment')
        .controller(deploymentController);

})();
