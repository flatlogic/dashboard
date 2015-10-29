(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .factory("RecursionHelper", RecursionHelper)
        .directive("nestedTable", nestedTable);

    function RecursionHelper($compile) {
        // This helper allows to create recursive directives
        return {
            compile: compile
        };

        /**
         * Manually compiles the element, fixing the recursion loop.
         * @param element
         * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
         * @returns An object containing the linking functions.
         */
        function compile(element, link) {
            // Normalize the link parameter
            if (angular.isFunction(link)) {
                link = {post: link};
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
                pre: (link && link.pre) ? link.pre : null,
                /**
                 * Compiles and re-adds the contents
                 */
                post: function (scope, element) {
                    // Compile the contents
                    if (!compiledContents) {
                        compiledContents = $compile(contents);
                    }
                    // Re-add the compiled contents to the element
                    compiledContents(scope, function (clone) {
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if (link && link.post) {
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    }

    function nestedTable(RecursionHelper) {
        /**
         * Data-driven table that auto-rendered from JSON.
         * example: <nested-table class="table-class" data="dataObject"></nested-table>
         */
        return {
            restrict: "AEC",
            scope: {
                data: '=',
                parentKey: '=',
                onchange: '='
            },
            replace: true,
            bindToController: true,
            templateUrl: 'app/modules/core/nested-table/nested-table.html',
            compile: compile,
            controller: nestedTableController,
            controllerAs: 'vm'
        };

        function compile(element) {
            // Use the compile function from the RecursionHelper,
            // And return the linking function(s) which it returns
            return RecursionHelper.compile(element);
        }

        function nestedTableController($scope) {
            var vm = this;

            vm.isObject = isObject;
            vm.isArray = isArray;

            vm.addElementToArray = addElementToArray;
            vm.updateData = updateData;

            function isObject(thing) {
                return angular.isObject(thing);
            }

            function isArray(thing) {
                return angular.isArray(thing);
            }

            function addElementToArray(pathToArray) {
                vm.data.push('');
                vm.onchange(pathToArray);
            }

            function updateData(pathToArray, data) {
                vm.onchange(pathToArray, data);
            }
        }
    }

})();

