(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.containers.container.logs')
        .controller('DockerContainerLogsController', dockerContainerLogsController);

    function dockerContainerLogsController($interval, $scope, $q, $stateParams, $location, $anchorScroll, dockerService, resolvedContainer, resolvedContainerLogsStdout, resolvedContainerLogsStderr) {

        function prosessLogData(data) {
            // Replace carriage returns with newlines to clean up output
            data = data.replace(/[\r]/g, '\n');
            // Strip 8 byte header from each line of output
            data = data.substring(8);
            data = data.replace(/\n(.{8})/g, '\n');
            return data;
        }

        function getLogs() {
            var promises = [
                dockerService.getContainerLogs($stateParams.containerId, {
                    stdout: 1,
                    stderr: 0,
                    timestamps: vm.showTimestamps,
                    tail: vm.tailLines
                }),
                dockerService.getContainerLogs($stateParams.containerId, {
                    stdout: 0,
                    stderr: 1,
                    timestamps: vm.showTimestamps,
                    tail: vm.tailLines
                })
            ];
            $q.all(promises).then(function(data){
                vm.stdout = prosessLogData(data[0]);
                vm.stderr = prosessLogData(data[1]);
            });
        }

        var vm = this;
        var logIntervalId = $interval(getLogs, 5000);

        vm.showTimestamps = false;
        vm.tailLines = 2000;
        vm.container = resolvedContainer;
        vm.stdout = prosessLogData(resolvedContainerLogsStdout);
        vm.stderr = prosessLogData(resolvedContainerLogsStderr);

        $scope.$on("$destroy", function() {
            // clearing interval when view changes
            $interval.cancel(logIntervalId);
        });

        vm.scrollTo = function(id) {
            $location.hash(id);
            $anchorScroll();
        };

        vm.toggleTimestamps = function() {
            getLogs();
        };

        vm.toggleTail = function() {
            getLogs();
        };
    }

})();
