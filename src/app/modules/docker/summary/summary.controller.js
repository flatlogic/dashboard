(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.summary')
        .controller('DockerSummaryController', dockerSummaryController);

    function dockerSummaryController(resolvedContainers, resolvedImages, DockerViewModel) {


        function buildContainersChart() {
            var c = new Chart($('#containers-chart').get(0).getContext("2d"));
            var opts = {animation: false};
            var data = [
                {
                    value: running,
                    color: '#5bb75b',
                    title: 'Running',
                    label: 'Running'
                }, // running
                {
                    value: stopped,
                    color: '#C7604C',
                    title: 'Stopped',
                    label: 'Stopped'
                }, // stopped
                {
                    value: ghost,
                    color: '#E2EAE9',
                    title: 'Ghost',
                    label: 'Ghost'
                } // ghost
            ];

            c.Doughnut(data, opts);
            var lgd = $('#chart-legend').get(0);
            legend(lgd, data);
        }



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
        })

        buildContainersChart();


    };

})();
