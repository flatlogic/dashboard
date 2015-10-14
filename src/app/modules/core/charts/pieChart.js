(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .directive('pieChart', pieChart);

        function pieChart() {
            return {
                restrict: 'E',
                link: linkFn,
                replace: false,
                scope: {
                    data: '='
                },
                template: '<canvas></canvas><div></div>'
            };

            // TODO: replace Chart by D3

            function linkFn($scope, $elem) {
                var chart = new Chart($elem.find('canvas').get(0).getContext("2d"));
                var lgd = $elem.find('div').get(0);
                var opts = {
                    animation: false
                };
                $scope.$watch('data', function(newVal, oldVal) {
                    if (newVal) {
                        chart.Doughnut(newVal, opts);
                        legend(lgd, newVal);
                    }
                });
            }
        }
})();
