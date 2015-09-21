(function () {
    'use strict';

    angular.module('qorDash.docker.domain.dockers.menu.info')
        .controller('DockerInfoController', dockerInfoController);


    dockerInfoController.$inject = ['$scope', 'System', 'Docker', 'Settings', '$stateParams'];
    function dockerInfoController($scope, System, Docker, Settings, $stateParams) {
        $scope.info = {};
        $scope.docker = {};
        $scope.endpoint = Settings.endpoint;
        $scope.apiVersion = Settings.version;

        Docker.get({domain: $stateParams.domain,instance: $stateParams.instance, dockerId: $stateParams.dockerId}, function (d) {
            $scope.docker = d;
        });
        System.get({domain: $stateParams.domain,instance: $stateParams.instance, dockerId: $stateParams.dockerId}, function (d) {
            $scope.info = d;
        });
    }
})();