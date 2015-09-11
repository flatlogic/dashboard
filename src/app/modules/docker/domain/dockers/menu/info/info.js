(function () {
    'use strict';

    angular.module('qorDash.docker.domain.dockers.menu.info')
        .controller('DockerInfoController', dockerInfoController);


    dockerInfoController.$inject = ['$scope', 'System', 'Docker', 'Settings', 'Messages'];
    function dockerInfoController($scope, System, Docker, Settings, Messages) {
        $scope.info = {};
        $scope.docker = {};
        $scope.endpoint = Settings.endpoint;
        $scope.apiVersion = Settings.version;

        Docker.get({}, function (d) {
            $scope.docker = d;
        });
        System.get({}, function (d) {
            $scope.info = d;
        });
    }
})();