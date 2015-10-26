(function () {
    'use strict';

    angular
        .module('qorDash.docker.domain.dockers.menu.containers.container.stats')
        .controller('DockerContainerStatsController', dockerContainerStatsController);


    function dockerContainerStatsController($scope, $interval, $stateParams, $sce, Messages, Settings, Container, humansizeFilter) {
        var vm = this;
        var urlParams = angular.extend({id: $stateParams.containerId}, Settings.urlParams);
        var cpuLabels = [];
        var cpuData = [];
        var memoryLabels = [];
        var memoryData = [];
        var networkLabels = [];
        var networkTxData = [];
        var networkRxData = [];
        var lastRxBytes = 0;
        var lastTxBytes = 0;
        for (var i = 0; i < 20; i++) {
            cpuLabels.push('');
            cpuData.push(0);
            memoryLabels.push('');
            memoryData.push(0);
            networkLabels.push('');
            networkTxData.push(0);
            networkRxData.push(0);
        }

        vm.cpuStyles = [{ // CPU Usage
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            data: cpuData
        }];

        vm.memoryStyles = [{
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            data: memoryData
        }];

        vm.networkStyles = [
            {
                label: "Rx Bytes",
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff"
            },
            {
                label: "Tx Bytes",
                fillColor: "rgba(255,180,174,0.5)",
                strokeColor: "rgba(255,180,174,1)",
                pointColor: "rgba(255,180,174,1)",
                pointStrokeColor: "#fff"
            }
        ];

        vm.networkLegendData = [
            'Rx Data', 'Tx Data'
        ];

        vm.chartOtions = {
          animation: false,
          animationSteps: 30,
          pointHitDetectionRadius: 3,
          responsive: true
        };

        vm.memoryChartOptions = vm.networkChartOptions = angular.extend(
            {
                scaleLabel: function (valueObj) {
                    return humansizeFilter(parseInt(valueObj.value, 10));
                }
            },
            vm.chartOtions
        );

        vm.cpuData = [cpuData];
        vm.cpuLabels = cpuLabels;
        vm.memoryData = [memoryData];
        vm.memoryLabels = memoryLabels;
        vm.networkData = [networkRxData, networkTxData];
        vm.networkLabels = networkLabels;


        function updateStats() {
            Container.stats(urlParams, function (d) {
                var arr = Object.keys(d).map(function (key) {
                    return d[key];
                });
                if (arr.join('').indexOf('no such id') !== -1) {
                    Messages.error('Unable to retrieve stats', 'Is this container running?');
                    return;
                }
                // Update graph with latest data
                vm.data = d;
                updateCpuChart(d);
                updateMemoryChart(d);
                updateNetworkChart(d);
            }, function () {
                Messages.error('Unable to retrieve stats', 'Is this container running?');
            });
        }

        function updateCpuChart(data) {
            console.log('updateCpuChart', data);
            if (vm.cpuData[0].length >= 20) {
              vm.cpuLabels = vm.cpuLabels.slice(1);
              vm.cpuData[0] = vm.cpuData[0].slice(1);
            }
            vm.cpuLabels.push(new Date(data.read).toLocaleTimeString());
            vm.cpuData[0].push(calculateCPUPercent(data));
        }

        function updateMemoryChart(data) {
            console.log('updateMemoryChart', data);
            if (vm.memoryData[0].length >= 20) {
              vm.memoryLabels = vm.memoryLabels.slice(1);
              vm.memoryData[0] = vm.memoryData[0].slice(1);
            }
            vm.memoryLabels.push(new Date(data.read).toLocaleTimeString());
            vm.memoryData[0].push(data.memory_stats.usage);
        }

        function updateNetworkChart(data) {
            var rxBytes = 0, txBytes = 0;
            if (lastRxBytes !== 0 || lastTxBytes !== 0) {
                // These will be zero on first call, ignore to prevent large graph spike
                rxBytes = data.network.rx_bytes - lastRxBytes;
                txBytes = data.network.tx_bytes - lastTxBytes;
            }
            lastRxBytes = data.network.rx_bytes;
            lastTxBytes = data.network.tx_bytes;
            console.log('updateNetworkChart', data);

            if (vm.networkData[0].length >= 20 && vm.networkData[1].length >= 20) {
              vm.networkLabels = vm.networkLabels.slice(1);
              vm.networkData[0] = vm.networkData[0].slice(1);
              vm.networkData[1] = vm.networkData[1].slice(1);
            }
            vm.networkLabels.push(new Date(data.read).toLocaleTimeString());
            vm.networkData[0].push(rxBytes);
            vm.networkData[1].push(txBytes);
        }

        function calculateCPUPercent(stats) {
            // Same algorithm the official client uses: https://github.com/docker/docker/blob/master/api/client/stats.go#L195-L208
            var prevCpu = stats.precpu_stats;
            var curCpu = stats.cpu_stats;

            var cpuPercent = 0.0;

            // calculate the change for the cpu usage of the container in between readings
            var cpuDelta = curCpu.cpu_usage.total_usage - prevCpu.cpu_usage.total_usage;
            // calculate the change for the entire system between readings
            var systemDelta = curCpu.system_cpu_usage - prevCpu.system_cpu_usage;

            if (systemDelta > 0.0 && cpuDelta > 0.0) {
                //console.log('size thing:', curCpu.cpu_usage.percpu_usage);
                cpuPercent = (cpuDelta / systemDelta) * curCpu.cpu_usage.percpu_usage.length * 100.0;
            }
            return cpuPercent;
        }


        var intervalId = $interval(updateStats, 2000);
        updateStats();

        $scope.$on('$destroy', function () {
            $interval.cancel(intervalId);
        });



    }
})();
