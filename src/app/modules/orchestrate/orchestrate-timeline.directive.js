(function () {
    'use strict';

    angular.module('qorDash.orchestrate')
        .directive('orchestrateTimeline', orchestrateTimeline);

    function orchestrateTimeline($compile) {
        return {
            restrict: 'E',
            template: '<div></div>',
            link: link
        };

        function link(scope, element, attrs) {
            scope.$watch(attrs.url, function(newValue, oldValue){
                if (!!newValue && newValue != oldValue) {
                    element.html($compile("<div ql-widget=\"Timeline\" ws-url=\"'"+ newValue +"'\"></div>")(scope));
                }
            }, true);
        }
    }
})();