(function() {
    'use strict';

    var configurationsController = angular.createAuthorizedController('ConfigurationsController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

    }]);

    angular.module('qorDash.configurations')
        .controller(configurationsController);

})();
