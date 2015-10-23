(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .directive('lineChart', lineChart);

        function lineChart() {
            return {
                restrict: 'E',
                controller: CtrlFn,
                controllerAs: 'vm',
                bindToController: true,
                replace: false,
                scope: {
                    data: '='
                },
                template: '<canvas class="chart chart-line" chart-colours="vm.lineChartColours"  chart-options="vm.options" chart-data="vm.dataset" chart-labels="vm.labels"></canvas>'
            };

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
                return [data, labels];
            }


            function CtrlFn($scope) {
                var vm = this;
                $scope.$watch('vm.data', function(newVal){
                    if (newVal) {
                        var map = createMap(newVal);
                        var chartData = createChartData(map);
                        vm.dataset = [chartData[0]];
                        vm.labels = chartData[1];
                        vm.options = {
                            maintainAspectRatio: false,
                            scaleStepWidth: 1,
                            pointDotRadius: 1,
                            scaleOverride: true,
                            scaleSteps: vm.labels.length
                        };
                        vm.lineChartColours = [{
                            fillColor: "rgba(151,187,205,0.5)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff"
                        }];
                    }
                });
            }
        }
})();
