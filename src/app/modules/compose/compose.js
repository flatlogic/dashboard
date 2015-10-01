(function () {
    'use strict';

    var composeController = angular.createAuthorizedController('ComposeController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
        $scope.number = 1;
        $scope.plus = function(){
            $scope.number++;
        }
    }]);

    angular.module('qorDash.compose')
        .controller(composeController);

})();
