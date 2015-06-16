(function() {
    'use strict';

    var orchestrateController = angular.createAuthorizedController('OrchestrateController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

    }]);

    angular.module('qorDash.orchestrate')
        .controller(orchestrateController);

})();
