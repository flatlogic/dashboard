(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .directive('lineChart', lineChart);

        function lineChart() {
            return {
                restrict: 'E',
                link: linkFn,
                replace: true,
                scope: {
                    data: '='
                },
                template: '<canvas></canvas>',
                controller: CtrlFn,
                controllerAs: 'vm',
                bindToController: true
            };

// TODO: replace Chart by D3

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

            function linkFn($scope, $elem) {
                var chart = new Chart($elem.get(0).getContext("2d"));
                $scope.$watch('vm.dataset', function(newVal, oldVal) {
                    if (newVal) {
                        chart.Line({
                            labels: newVal.labels,
                            datasets: [newVal]
                        },
                        {
                            scaleStepWidth: 1,
                            pointDotRadius: 1,
                            scaleOverride: false,
                            scaleSteps: newVal.labels.length
                        });
                    }
                });
            }

            function CtrlFn($scope) {
                var vm = this;

                $scope.$watch('vm.data', function(newVal){
                    if(newVal) {
                        var map = createMap(vm.data);
                        var chartData = createChartData(map);
                        vm.dataset = {
                            fillColor: "rgba(151,187,205,0.5)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            data: chartData[0],
                            labels: chartData[1]
                        };
                    }
                });
            }
        }
})();
