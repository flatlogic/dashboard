(function () {
    'use strict';

    angular.module('qorDash.docker.domain.dockers.menu.containers')
        .controller('ContainersController', containersController);

    containersController.$inject = ['$scope', 'Container', 'Settings', 'Messages'];
    function containersController($scope, Container, Settings, Messages) {
        $scope.predicate = '-Created';
        $scope.toggle = false;
        $scope.displayAll = Settings.displayAll;

        var urlParams = Settings.urlParams;

        var update = function (data) {
            Container.query(angular.extend(data, urlParams), function (d) {
                $scope.containers = d.map(function (item) {
                    return new ContainerViewModel(item);
                });
            });
        };

        var batch = function (items, action, msg) {
            var counter = 0;
            var complete = function () {
                counter = counter - 1;
                if (counter === 0) {
                    update({all: Settings.displayAll ? 1 : 0});
                }
            };
            angular.forEach(items, function (c) {
                if (c.Checked) {
                    if (action === Container.start) {
                        Container.get(angular.extend({id: c.Id}, urlParams), function (d) {
                            c = d;
                            counter = counter + 1;
                            action(angular.extend({id: c.Id, HostConfig: c.HostConfig || {}}, urlParams), function (d) {
                                Messages.send("Container " + msg, c.Id);
                                var index = $scope.containers.indexOf(c);
                                complete();
                            }, function (e) {
                                Messages.error("Failure", e.data);
                                complete();
                            });
                        }, function (e) {
                            if (e.status === 404) {
                                $('.detail').hide();
                                Messages.error("Not found", "Container not found.");
                            } else {
                                Messages.error("Failure", e.data);
                            }
                            complete();
                        });
                    }
                    else {
                        counter = counter + 1;
                        action(angular.extend({id: c.Id}, urlParams), function (d) {
                            Messages.send("Container " + msg, c.Id);
                            var index = $scope.containers.indexOf(c);
                            complete();
                        }, function (e) {
                            Messages.error("Failure", e.data);
                            complete();
                        });

                    }

                }
            });
        };

        $scope.toggleSelectAll = function () {
            angular.forEach($scope.containers, function (i) {
                i.Checked = $scope.toggle;
            });
        };

        $scope.toggleGetAll = function () {
            Settings.displayAll = $scope.displayAll;
            update({all: Settings.displayAll ? 1 : 0});
        };

        $scope.startAction = function () {
            batch($scope.containers, Container.start, "Started");
        };

        $scope.stopAction = function () {
            batch($scope.containers, Container.stop, "Stopped");
        };

        $scope.restartAction = function () {
            batch($scope.containers, Container.restart, "Restarted");
        };

        $scope.killAction = function () {
            batch($scope.containers, Container.kill, "Killed");
        };

        $scope.pauseAction = function () {
            batch($scope.containers, Container.pause, "Paused");
        };

        $scope.unpauseAction = function () {
            batch($scope.containers, Container.unpause, "Unpaused");
        };

        $scope.removeAction = function () {
            batch($scope.containers, Container.remove, "Removed");
        };

        update({all: Settings.displayAll ? 1 : 0});
    };
})();
