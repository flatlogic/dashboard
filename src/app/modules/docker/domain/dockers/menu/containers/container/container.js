(function () {
    'use strict';

    angular.module('qorDash.docker.domain.dockers.menu.containers.container')
        .controller('ContainerController', containerController);

    containerController.$inject = ['$scope', '$stateParams', '$location', 'Container', 'ContainerCommit', 'Messages'];
    function containerController($scope, $stateParams, $location, Container, ContainerCommit, Messages) {
            $scope.changes = [];
            $scope.edit = false;

            var update = function () {
                Container.get({id: $stateParams.containerId}, function (d) {
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
                Container.start({
                    id: $scope.container.Id,
                    HostConfig: $scope.container.HostConfig
                }, function (d) {
                    update();
                    Messages.send("Container started", $stateParams.containerId);
                }, function (e) {
                    update();
                    Messages.error("Failure", "Container failed to start." + e.data);
                });
            };

            $scope.stop = function () {
                Container.stop({id: $stateParams.containerId}, function (d) {
                    update();
                    Messages.send("Container stopped", $stateParams.containerId);
                }, function (e) {
                    update();
                    Messages.error("Failure", "Container failed to stop." + e.data);
                });
            };

            $scope.kill = function () {
                Container.kill({id: $stateParams.containerId}, function (d) {
                    update();
                    Messages.send("Container killed", $stateParams.containerId);
                }, function (e) {
                    update();
                    Messages.error("Failure", "Container failed to die." + e.data);
                });
            };

            $scope.commit = function () {
                ContainerCommit.commit({id: $stateParams.containerId, repo: $scope.container.Config.Image}, function (d) {
                    update();
                    Messages.send("Container commited", $stateParams.containerId);
                }, function (e) {
                    update();
                    Messages.error("Failure", "Container failed to commit." + e.data);
                });
            };
            $scope.pause = function () {
                Container.pause({id: $stateParams.containerId}, function (d) {
                    update();
                    Messages.send("Container paused", $stateParams.containerId);
                }, function (e) {
                    update();
                    Messages.error("Failure", "Container failed to pause." + e.data);
                });
            };

            $scope.unpause = function () {
                Container.unpause({id: $stateParams.containerId}, function (d) {
                    update();
                    Messages.send("Container unpaused", $stateParams.containerId);
                }, function (e) {
                    update();
                    Messages.error("Failure", "Container failed to unpause." + e.data);
                });
            };

            $scope.remove = function () {
                Container.remove({id: $stateParams.containerId}, function (d) {
                    update();
                    Messages.send("Container removed", $stateParams.containerId);
                }, function (e) {
                    update();
                    Messages.error("Failure", "Container failed to remove." + e.data);
                });
            };

            $scope.restart = function () {
                Container.restart({id: $stateParams.containerId}, function (d) {
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
                Container.changes({id: $stateParams.containerId}, function (d) {
                    $scope.changes = d;
                });
            };

            $scope.renameContainer = function () {
                // #FIXME fix me later to handle http status to show the correct error message
                Container.rename({id: $stateParams.containerId, 'name': $scope.container.newContainerName}, function (data) {
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
        };

})();