(function () {
    'use strict';

    angular.module('qorDash.docker.domain.dockers.menu.info')
        .controller('DockerInfoController', dockerInfoController);


    dockerInfoController.$inject = ['$scope', 'System', 'Docker', 'Settings'];
    function dockerInfoController($scope, System, Docker, Settings) {
        $scope.info = {};
        $scope.docker = {};
        $scope.endpoint = Settings.endpoint;
        $scope.apiVersion = Settings.version;

        var urlParams = Settings.urlParams;

        Docker.get(urlParams, function (d) {
            $scope.docker = d;
        });
        System.get(urlParams, function (d) {
            $scope.info = d;
        });
    }
})();
