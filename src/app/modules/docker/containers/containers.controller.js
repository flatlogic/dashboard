(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.containers')
        .controller('ContainersController', containersController);

    function containersController($scope, $q, Container, Settings, DockerViewModel, resolveContainers) {
        var vm = this;
        var urlParams = Settings.urlParams;

        vm.predicate = '-Created';
        vm.toggle = false;
        vm.displayAll = Settings.displayAll;
        vm.containers = resolveContainers.map(DockerViewModel.container);

        $scope.$on('updateContainersList', function(data, event){
            update({all: Number(Settings.displayAll)});
        });

        function update(data) {
            Container.query(angular.extend(data, urlParams), function (d) {
                vm.containers = d.map(DockerViewModel.container);
            });
        };


        function batch (action, msg) {
            // TODO: handle msg messages ?
            var promises = [];
            var selectedContainers = vm.containers.filter(function(c){
                return c.Checked;
            });
            selectedContainers.forEach(function(c){
                var containerParams = angular.extend({id: c.Id}, urlParams);
                if (action === Container.start) {
                    promises.push(
                        Container.get(containerParams).$promise.then(function(d){
                            return action(angular.extend({HostConfig: d.HostConfig || {}}, containerParams)).$promise;
                        })
                    )
                } else {
                    promises.push(action(containerParams).$promise);
                }
            });
            $q.all(promises).then(function(){
                update({all: Number(Settings.displayAll)});
            });
        };

        vm.toggleSelectAll = function () {
            vm.containers.forEach(function (i) {
                i.Checked = vm.toggle;
            });
        };

        vm.toggleGetAll = function () {
            Settings.displayAll = vm.displayAll;
            update({all: Number(Settings.displayAll)});
        };

        vm.startAction = function () {
            batch(Container.start, "Started");
        };

        vm.stopAction = function () {
            batch(Container.stop, "Stopped");
        };

        vm.restartAction = function () {
            batch(Container.restart, "Restarted");
        };

        vm.killAction = function () {
            batch(Container.kill, "Killed");
        };

        vm.pauseAction = function () {
            batch(Container.pause, "Paused");
        };

        vm.unpauseAction = function () {
            batch(Container.unpause, "Unpaused");
        };

        vm.removeAction = function () {
            batch(Container.remove, "Removed");
        };
    };
})();
