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
                console.log(pathForCheck, '===', vm.displayOptions);
                return !!(! pathForCheck || vm.displayOptions[pathForCheck]);
            }

            function changeDisplayState(path) {
                console.log('Change: ' + path);
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

                var c = true,
                    tempPath = path;
                while (tempPath && tempPath.length > 1) {
                    if ((tempPath && vm.config[tempPath] && vm.config[tempPath].indexOf('edit') > -1)) {
                        return true;
                    }
                    tempPath = tempPath.split('.').splice(0, tempPath.split('.').length - 1).join('.');
                }
                return false;
            }

            function isPlusAvailable(path) {
                if (!path) {return false;}

                var splitedPath = path.split('.');

                if (splitedPath[1] == 'services') {
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
                return angular.isArray(thing);
            }

            function addElement(path) {
                if (vm.isArray(vm.data)) {
                    vm.data.push('');
                    vm.onchange(path);
                } else {
                    debugger;
                    var newObject = {};
                    var lastKey = Object.keys(vm.data)[Object.keys(vm.data).length - 1],
                        newKey = lastKey + '-new';

                    newObject[newKey] = jQuery.extend(true, {}, vm.data[lastKey]);

                    vm.data[newKey] = jQuery.extend(true, {}, vm.data[lastKey]);

                    vm.onchange(path, newObject);
                }
            }

            function updateData(pathToArray, data) {
                vm.onchange(vm.objectName, pathToArray, data);
            }
        }
    }

})();

