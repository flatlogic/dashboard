(function () {
    'use strict';

    angular.module('qorDash.docker.domain.dockers.menu.containers.container')
        .controller('ContainerController', containerController);

    containerController.$inject = ['$scope', '$stateParams', '$location', 'Container', 'ContainerCommit', 'Messages', 'Settings'];
    function containerController($scope, $stateParams, $location, Container, ContainerCommit, Messages, Settings) {
            $scope.changes = [];
            $scope.edit = false;

            var urlParams = angular.extend({id: $stateParams.containerId}, Settings.urlParams);

            var update = function () {
                Container.get(urlParams, function (d) {
                    $scope.container = d;
                    $scope.container.edit = false;
                    $scope.container.newContainerName = d.Name;
                }, function (e) {
                    if (e.status === 404) {
                        $('.detail').hide();
                        Messages.error("Not found", "Container not found.");
                    } else {
                        Messages.error("Failure", e.data);
                    }
                });
            };

            $scope.start = function () {
                Container.start(angular.extend({HostConfig: $scope.container.HostConfig}, urlParams), function (d) {
                    update();
                    Messages.send("Container started", $stateParams.containerId);
                }, function (e) {
                    update();
                    Messages.error("Failure", "Container failed to start." + e.data);
                });
            };

            $scope.stop = function () {
                Container.stop(urlParams, function (d) {
                    update();
                    Messages.send("Container stopped", $stateParams.containerId);
                }, function (e) {
                    update();
                    Messages.error("Failure", "Container failed to stop." + e.data);
                });
            };

            $scope.kill = function () {
                Container.kill(urlParams, function (d) {
                    update();
                    Messages.send("Container killed", $stateParams.containerId);
                }, function (e) {
                    update();
                    Messages.error("Failure", "Container failed to die." + e.data);
                });
            };

            $scope.commit = function () {
                ContainerCommit.commit(angular.extend({repo: $scope.container.Config.Image}, urlParams), function (d) {
                    update();
                    Messages.send("Container commited", $stateParams.containerId);
                }, function (e) {
                    update();
                    Messages.error("Failure", "Container failed to commit." + e.data);
                });
            };
            $scope.pause = function () {
                Container.pause(urlParams, function (d) {
                    update();
                    Messages.send("Container paused", $stateParams.containerId);
                }, function (e) {
                    update();
                    Messages.error("Failure", "Container failed to pause." + e.data);
                });
            };

            $scope.unpause = function () {
                Container.unpause(urlParams, function (d) {
                    update();
                    Messages.send("Container unpaused", $stateParams.containerId);
                }, function (e) {
                    update();
                    Messages.error("Failure", "Container failed to unpause." + e.data);
                });
            };

            $scope.remove = function () {
                Container.remove(urlParams, function (d) {
                    update();
                    Messages.send("Container removed", $stateParams.containerId);
                }, function (e) {
                    update();
                    Messages.error("Failure", "Container failed to remove." + e.data);
                });
            };

            $scope.restart = function () {
                Container.restart(urlParams, function (d) {
                    update();
                    Messages.send("Container restarted", $stateParams.containerId);
                }, function (e) {
                    update();
                    Messages.error("Failure", "Container failed to restart." + e.data);
                });
            };

            $scope.hasContent = function (data) {
                return data !== null && data !== undefined;
            };

            $scope.getChanges = function () {
                Container.changes(urlParams, function (d) {
                    $scope.changes = d;
                });
            };

            $scope.renameContainer = function () {
                // #FIXME fix me later to handle http status to show the correct error message
                Container.rename(angular.extend({'name': $scope.container.newContainerName}, urlParams), function (data) {
                    if (data.name) {
                        $scope.container.Name = data.name;
                        Messages.send("Container renamed", $stateParams.containerId);
                    } else {
                        $scope.container.newContainerName = $scope.container.Name;
                        Messages.error("Failure", "Container failed to rename.");
                    }
                });
                $scope.container.edit = false;
            };

            update();
            $scope.getChanges();
        }

})();
