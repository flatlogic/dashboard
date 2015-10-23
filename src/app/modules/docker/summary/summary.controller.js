(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.summary')
        .controller('DockerSummaryController', dockerSummaryController);

    function dockerSummaryController(resolvedContainers, resolvedImages, DockerViewModel) {

        var vm = this,
            running = 0,
            ghost = 0,
            stopped = 0;

        vm.predicate = '-Created';
        vm.containers = [];
        vm.totalContainers = resolvedContainers;
        vm.totalImages = resolvedImages;

        vm.totalContainers.forEach(function(item){
            if (item.Status === "Ghost") {
                ghost += 1;
            } else if (item.Status.indexOf('Exit') !== -1) {
                stopped += 1;
            } else {
                running += 1;
                vm.containers.push(DockerViewModel.container(item));
            }
        });

        vm.colours = ["#5bb75b", "#C7604C", "#E2EAE9"];
        vm.labels = vm.series = ["Running", "Stopped", "Ghost"];
        vm.dataset = [
            running,
            stopped,
            ghost
        ];
    };
})();
