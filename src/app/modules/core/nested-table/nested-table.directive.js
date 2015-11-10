(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .factory("RecursionHelper", RecursionHelper)
        .directive("nestedTable", nestedTable)
        .filter('orderObjectBy', function() {
            return function(items, field, reverse) {
                var filtered = [];
                angular.forEach(items, function(item) {
                    filtered.push(item);
                });
                filtered.sort(function (a, b) {
                    return (a[field] > b[field] ? 1 : -1);
                });
                if(reverse) filtered.reverse();
                return filtered;
            };
        });

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
            controller: nestedTableController,
            controllerAs: 'vm'
        };

        function compile(element) {
            // Use the compile function from the RecursionHelper,
            // And return the linking function(s) which it returns
            return RecursionHelper.compile(element);
        }

        function nestedTableController() {
            var vm = this;

            if (!vm.displayOptions) {
                vm.displayOptions = {};
            }

            vm.isObject = isObject;
            vm.isArray = isArray;
            vm.isEditable = isEditable;
            vm.isPlusAvailable = isPlusAvailable;
            vm.isVisible = isVisible;
            vm.changeDisplayState = changeDisplayState;
            vm.getDisplayState = getDisplayState;

            vm.addElement = addElement;
            vm.updateData = updateData;

            function isVisible(path) {
                if (!path) return true;

                var splitedPath = path.split('.');

                splitedPath.pop();
                var pathForCheck = splitedPath.join('.');
                return !!(! pathForCheck || vm.displayOptions[pathForCheck]);
            }

            function changeDisplayState(path) {
                vm.displayOptions[path] = !vm.displayOptions[path];
            }

            function getDisplayState(path) {
                return !!(vm.displayOptions[path]);
            }

            function isEditable(path) {
                if (!path) {return false;}

                var splitedPath = path.split('.');

                if (splitedPath[1] == 'services') {
                    if (splitedPath[2]) { splitedPath[2] = '*'; }
                    path = splitedPath.join('.');
                }

                return !!(vm.config[path] && vm.config[path].indexOf('edit') > -1);
            }

            function isPlusAvailable(path) {
                if (!path) {return false;}

                var splitedPath = path.split('.');

                if (splitedPath[1] === 'services') {
                    if (splitedPath[2]) { splitedPath[2] = '*'; }
                    path = splitedPath.join('.');
                    return (path && vm.config[path] && vm.config[path].indexOf('add') > -1);
                } else {
                    return (path && vm.config[path] && vm.config[path].indexOf('add') > -1);
                }
            }

            function isObject(thing) {
                return angular.isObject(thing);
            }

            function isArray(thing) {
                if (angular.isArray(thing)) {
                    if (!isObject(thing[0])) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }

            function addElement(path) {
                if (vm.isArray(vm.data)) {
                    vm.onchange('add-value', path);
                } else {
                    var lastKey = Object.keys(vm.data)[Object.keys(vm.data).length - 1];
                    vm.onchange('add-object', path, vm.data[lastKey], lastKey + '-new');
                }
            }

            function updateData(pathToArray, data, oldValue, type) {
                if (type == 'key') {
                    vm.onchange('edit-key', pathToArray, data, oldValue);
                } else {
                    vm.onchange('edit-value', pathToArray, data);
                }
            }
        }
    }

})();

