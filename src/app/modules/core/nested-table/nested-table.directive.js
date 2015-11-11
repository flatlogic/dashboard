(function () {
    'use strict';

    angular.module('qorDash.core')
        .directive("nestedTable", nestedTable);

    function nestedTable(RecursionHelper) {
        /**
         * Data-driven table that auto-rendered from JSON.
         * @param data Object to render
         * @param config Object for table configuration. It should be in following format: { path: [add|edit] }
         * example: <nested-table class="table-class" data="dataObject" config="configObject"></nested-table>
         */
        return {
            restrict: "AEC",
            scope: {
                data: '=',
                parentKey: '=',
                config: '=',
                onchange: '=',
                objectName: '=',
                displayOptions: '='
            },
            replace: true,
            bindToController: true,
            templateUrl: 'app/modules/core/nested-table/nested-table.html',
            compile: compile,
            controller: 'NestedTableController',
            controllerAs: 'vm'
        };

        function compile(element) {
            // Use the compile function from the RecursionHelper,
            // And return the linking function(s) which it returns
            return RecursionHelper.compile(element);
        }
    }
})();

