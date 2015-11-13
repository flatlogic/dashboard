(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .directive('autoScroll', autoScroll);

        function autoScroll() {
            return {
                link: function (scope, element, attrs) {
                    scope.$watch(
                        function () {
                            return element.children().height()
                        },
                        function (newValue, oldValue) {
                            if (newValue !== oldValue) {
                                $(element).scrollTop(element.children().height())
                            }
                        }
                    );
                }
            }
        }

})();
