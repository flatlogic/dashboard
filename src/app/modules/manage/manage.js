(function() {
    'use strict';

    var manageController = angular.createAuthorizedController('ManageController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

    }]);

    angular.module('qorDash.manage')
        .controller(manageController);

})();
