(function() {
    'use strict';

    angular.module('qorDash.core')
        .controller("NestedTableController", nestedTableController);

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
            if (vm.displayOptions[path]) {
                vm.displayOptions[path] = !vm.displayOptions[path];
            }
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
                return !!(path && vm.config[path] && vm.config[path].indexOf('add') > -1);
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
})();
