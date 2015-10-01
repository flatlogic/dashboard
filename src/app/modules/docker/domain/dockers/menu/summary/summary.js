(function () {
    'use strict';

    angular.module('qorDash.docker.domain.dockers.menu.summary')
        .controller('DockerSummaryController', dockerSummaryController);

    dockerSummaryController.$inject = ['$scope', '$stateParams', 'Container', 'Image', 'Settings', 'LineChart'];
    function dockerSummaryController($scope, $stateParams, Container, Image, Settings, LineChart) {
        $scope.predicate = '-Created';
        $scope.containers = [];

        var urlParams = angular.extend({id: $stateParams.containerId}, Settings.urlParams);

        var getStarted = function (data) {
            $scope.totalContainers = data.length;
            LineChart.build('#containers-started-chart', data, function (c) {
                return new Date(c.Created * 1000).toLocaleDateString();
            });
            var s = $scope;
            Image.query(urlParams, function (d) {
                s.totalImages = d.length;
                LineChart.build('#images-created-chart', d, function (c) {
                    return new Date(c.Created * 1000).toLocaleDateString();
                });
            });
        };

        var opts = {animation: false};
        if (Settings.firstLoad) {
            opts.animation = true;
            Settings.firstLoad = false;
            $('#masthead').show();

            setTimeout(function () {
                $('#masthead').slideUp('slow');
            }, 5000);
        }

        Container.query(angular.extend({all: 1}, urlParams), function (d) {
            var running = 0;
            var ghost = 0;
            var stopped = 0;

            for (var i = 0; i < d.length; i++) {
                var item = d[i];

                if (item.Status === "Ghost") {
                    ghost += 1;
                } else if (item.Status.indexOf('Exit') !== -1) {
                    stopped += 1;
                } else {
                    running += 1;
                    $scope.containers.push(new ContainerViewModel(item));
                }
            }

            getStarted(d);

            var c = new Chart($('#containers-chart').get(0).getContext("2d"));
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
        });
    };

})();
