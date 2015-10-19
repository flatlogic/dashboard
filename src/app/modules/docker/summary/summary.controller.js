(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.summary')
        .controller('DockerSummaryController', dockerSummaryController);

    function dockerSummaryController(resolvedContainers, resolvedImages, DockerViewModel) {

        function createMap(data) {
            var map = {};
            for (var i = 0; i < data.length; i++) {
                var c = data[i];
                var key = new Date(c.Created * 1000).toLocaleDateString();
                var count = map[key];
                if (count === undefined) {
                    count = 0;
                }
                count += 1;
                map[key] = count;
            }
            return map;
        }

        function createChartData(map) {
            var labels = [];
            var data = [];
            var keys = Object.keys(map);

            for (var i = keys.length - 1; i > -1; i--) {
                var k = keys[i];
                labels.push(k);
                data.push(map[k]);
            }
            return [[data], labels];
        }

        var vm = this,
            running = 0,
            ghost = 0,
            stopped = 0;

        vm.predicate = '-Created';
        vm.containers = [];
        resolvedContainers.forEach(function(item){
            if (item.Status === "Ghost") {
                ghost += 1;
            } else if (item.Status.indexOf('Exit') !== -1) {
                stopped += 1;
            } else {
                running += 1;
                vm.containers.push(DockerViewModel.container(item));
            }
        });

        vm.totalContainers = createChartData(createMap(resolvedContainers));
        vm.totalImages = createChartData(createMap(resolvedImages));

        vm.colours = ["#5bb75b", "#C7604C", "#E2EAE9"];
        vm.lineChartColours = [{
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff"
        }];
        vm.options = {
            maintainAspectRatio: false,
            scaleStepWidth: 1,
            pointDotRadius: 1,
            scaleOverride: true
        };
        vm.containersChartOptions = angular.extend({scaleSteps: vm.totalContainers[1].length}, vm.options);
        vm.imagesChartOptions = angular.extend({scaleSteps: vm.totalImages[1].length}, vm.options);

        vm.labels = vm.series = ["Running", "Stopped", "Ghost"];
        vm.dataset = [
            running,
            stopped,
            ghost
        ];
    };
})();
