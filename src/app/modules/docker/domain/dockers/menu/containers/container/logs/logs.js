(function () {
    'use strict';

    angular.module('qorDash.docker.domain.dockers.menu.containers.container.logs')
        .controller('DockerContainerLogsController', dockerContainerLogsController);


    dockerContainerLogsController.$inject = ['$scope', '$stateParams', '$location', '$anchorScroll', 'ContainerLogs', 'Container', 'Settings'];
    function dockerContainerLogsController($scope, $stateParams, $location, $anchorScroll, ContainerLogs, Container, Settings) {
        $scope.stdout = '';
        $scope.stderr = '';
        $scope.showTimestamps = false;
        $scope.tailLines = 2000;

        var urlParams = angular.extend({id: $stateParams.containerId}, Settings.urlParams);

        Container.get(urlParams, function (d) {
            $scope.container = d;
        }, function (e) {
            if (e.status === 404) {
                Messages.error("Not found", "Container not found.");
            } else {
                Messages.error("Failure", e.data);
            }
        });

        function getLogs() {
            ContainerLogs.get($stateParams.containerId, {
                stdout: 1,
                stderr: 0,
                timestamps: $scope.showTimestamps,
                tail: $scope.tailLines,
            }, function (data, status, headers, config) {
                // Replace carriage returns with newlines to clean up output
                data = data.replace(/[\r]/g, '\n');
                // Strip 8 byte header from each line of output
                data = data.substring(8);
                data = data.replace(/\n(.{8})/g, '\n');
                $scope.stdout = data;
            });

            ContainerLogs.get($stateParams.containerId, {
                stdout: 0,
                stderr: 1,
                timestamps: $scope.showTimestamps,
                tail: $scope.tailLines,
            }, function (data, status, headers, config) {
                // Replace carriage returns with newlines to clean up output
                data = data.replace(/[\r]/g, '\n');
                // Strip 8 byte header from each line of output
                data = data.substring(8);
                data = data.replace(/\n(.{8})/g, '\n');
                $scope.stderr = data;
            });
        }

        // initial call
        getLogs();
        var logIntervalId = window.setInterval(getLogs, 5000);

        $scope.$on("$destroy", function () {
            // clearing interval when view changes
            clearInterval(logIntervalId);
        });

        $scope.scrollTo = function (id) {
            $location.hash(id);
            $anchorScroll();
        };

        $scope.toggleTimestamps = function () {
            getLogs();
        };

        $scope.toggleTail = function () {
            getLogs();
        };
    }

})();
