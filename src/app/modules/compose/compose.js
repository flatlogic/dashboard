(function() {
    'use strict';

    var composeController = angular.createAuthorizedController('ComposeController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

    }]);

    angular.module('qorDash.compose')
        .controller(composeController);

})();
