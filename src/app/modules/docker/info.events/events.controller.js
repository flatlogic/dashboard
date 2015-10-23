(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.info.events')
        .controller('DockerInfoEventsController', dockerInfoEventsController);

    function dockerInfoEventsController($scope, $timeout, Settings, Oboe, Messages) {
        var vm = this;
        var url = Settings.url + '/events?';
        vm.model = {};
        vm.model.since = new Date(Date.now() - 86400000); // 24 hours in the past
        vm.model.until = new Date();
        vm.updateEvents();

        vm.updateEvents = function () {
            vm.dockerEvents = [];
            if (vm.model.since) {
                var sinceSecs = Math.floor(vm.model.since.getTime() / 1000);
                url += 'since=' + sinceSecs + '&';
            }
            if (vm.model.until) {
                var untilSecs = Math.floor(vm.model.until.getTime() / 1000);
                url += 'until=' + untilSecs;
            }

            Oboe({
                url: url,
                pattern: '{id status time}'
            })
                .then(function (node) {
                    // finished loading
                    $timeout(function () {
                        $scope.$apply();
                    });
                }, function (error) {
                    // handle errors
                    Messages.error("Failure", error.data);
                }, function (node) {
                    // node received
                    vm.dockerEvents.push(node);
                });
        };
    }
})();
