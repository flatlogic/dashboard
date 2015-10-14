(function () {
    'use strict';

    var module = angular.module('qorDash.docker.domain.dockers.menu')
        .controller('DockerMenuController', dockerMenuController);

    dockerMenuController.$inject = ['$scope', '$stateParams', '$http', 'API_URL', '$rootScope'];
    function dockerMenuController($scope, $stateParams, $http, API_URL, $rootScope) {
        $scope.$watch('dockers', function(value) {
            if (!value) {
                return;
            }
            $scope.docker = value[$stateParams.dockerId];
        });
        $scope.dockerId = $stateParams.dockerId;
    }

})();
