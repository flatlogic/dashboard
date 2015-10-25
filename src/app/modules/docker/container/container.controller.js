(function() {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.containers.container')
        .controller('ContainerController', containerController);

    function containerController($scope, $state, Container, Settings, resolvedContainer, resolvedContainerChanges, dockerService) {

            function getContainer() {
                Container.get(urlParams, function (d) {
                    vm.container = d;
                    vm.container.edit = false;
                    vm.container.newContainerName = d.Name;
                    $scope.$emit('updateContainersList');
                });
            };

            function updateContainer(action, params) {
                var containerParams;
                switch (action) {
                    case 'start':
                    case 'rename':
                        containerParams = angular.extend(params, urlParams);
                        break;
                    default:
                        containerParams = urlParams;
                        break;
                }
                return Container[action](containerParams).$promise.then(getContainer);
            }

            var vm = this;
            vm.container = resolvedContainer;
            vm.container.edit = false;
            vm.container.newContainerName = resolvedContainer.Name;
            vm.changes = resolvedContainerChanges;

            var urlParams = angular.extend({id: vm.container.Id}, Settings.urlParams);

            vm.hasContent = function (data) {
                return data !== null && data !== undefined;
            };

            vm.getChanges = function() {
                Container.changes(urlParams, function (d) {
                    vm.changes = d;
                });
            };

            vm.start = function() {
                updateContainer('start', {HostConfig: vm.container.HostConfig});
            };
            vm.rename = function() {
                updateContainer('rename', {name: vm.container.newContainerName});
            };
            vm.stop = function() {
                updateContainer('stop');
            };
            vm.kill = function() {
                updateContainer('kill');
            };
            vm.pause = function() {
                updateContainer('pause');
            };
            vm.unpause = function() {
                updateContainer('unpause');
            };
            vm.remove = function() {
                updateContainer('remove', null).then(function(){
                    $scope.$emit('updateContainersList');
                    $state.go('^');
                });
            };
            vm.restart = function() {
                updateContainer('restart');
            };
            vm.commit = function() {
                dockerService.containerCommit(vm.container.Id, vm.container.Config.Image).then(getContainer);
            };
        }
})();
