(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .factory("RecursionHelper", RecursionHelper)
        .directive("nestedTable", nestedTable);

    RecursionHelper.$inject = ['$compile'];

    function RecursionHelper($compile) {
        // This helper allows to create recursive directives
        return {
            /**
             * Manually compiles the element, fixing the recursion loop.
             * @param element
             * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
             * @returns An object containing the linking functions.
             */
            compile: function (element, link) {
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
    }

    function nestedTable(RecursionHelper) {
        /**
         * Data-driven table that auto-rendered from JSON.
         * example: <nested-table class="table-class" data="dataObject"></nested-table>
         */
        return {
            restrict: "AEC",
            scope: { data: '=' },
            replace: true,
            template:
                '<table>' +
                    '<tbody>' +
                        '<tr data-ng-repeat="(key, value) in data">' +
                            '<td class="white-bg" ng-if="!isArray(data)">{{key}} <i class="fa fa-angle-right"></i></td>' +
                            '<td class="white-bg" ng-if="!isObject(value)" editable-text="value" buttons="no">{{value}}</td>' +
                            '<td ng-if="isObject(value)" colspan="100">' +
                                '<nested-table data="value"></nested-table>' +
                            '</td>' +
                        '</tr>' +
                        '<tr ng-if="isArray(data)">' +
                            '<td class="white-bg">+</td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>',
            compile: function(element) {
                // Use the compile function from the RecursionHelper,
                // And return the linking function(s) which it returns
                return RecursionHelper.compile(element);
            },
            controller: function ($scope) {
                $scope.isObject = function (thing) {
                    return angular.isObject(thing);
                };

                $scope.isArray = function (thing) {
                    return angular.isArray(thing);
                };
            }
        };
    }

})();

