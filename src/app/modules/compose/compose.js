(function () {
    'use strict';

    angular
        .module('qorDash.compose')
        .controller('ComposeController', composeController);

    function composeController($scope, $rootScope, $location) {
        $scope.number = 1;
        $scope.plus = function(){
            $scope.number++;
        }
    }

})();
