(function () {
    'use strict';

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

    angular.module('qorDash.domains')
        .directive('autoScroll', autoScroll);
})();
