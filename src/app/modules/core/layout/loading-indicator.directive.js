(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .directive('loadingIndicator', loadingIndicator);

        function loadingIndicator($rootScope, $timeout) {
            return {
                restrict: 'E',
                link: linkFn,
                replace: true,
                template: '<div class="loading-indicator"><img class="hide" src="assets/images/cube.gif"></div>',
                controller: CtrlFn,
                controllerAs: 'vm',
                bindToController: true
            };

            function linkFn($scope, $elem, attrs) {
                $scope.$watch('vm.isSpinning', function(newVal, oldVal) {
                    var image = $elem.find('img');
                    $timeout(function () {
                        image.toggleClass('show', newVal);
                    });
                });
            }

            function CtrlFn() {
                var vm = this;
                vm.isSpinning = false;

                $rootScope.$on('$stateChangeStart', show);
                $rootScope.$on('$stateChangeSuccess', hide);
                $rootScope.$on('$stateChangeError', hide);

                function show(event, toState, toParams) {
                    if (toState.resolve) {
                        vm.isSpinning = true;
                    }
                }

                function hide(event, toState, toParams, fromState, fromParams) {
                    vm.isSpinning = false;
                }
            }

        }

})();
