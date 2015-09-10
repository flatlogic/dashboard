(function () {
    'use strict';

    angular.module('qorDash.docker.domain.dockers.menu')
        .controller('DockerMenuController', dockerMenuController);

    dockerMenuController.$inject = ['$scope', '$stateParams', '$http', 'API_URL'];
    function dockerMenuController($scope, $stateParams, $http, API_URL) {
        $scope.dockerId = $stateParams.dockerId;
    }

})();
