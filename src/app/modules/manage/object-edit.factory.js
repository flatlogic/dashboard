(function() {
    'use strict';

    angular
        .module('qorDash.manage')
        .factory('objectEdit', objectEdit);


    function objectEdit() {
        return {
            dataChanged: dataChanged
        }
    }

    function dataChanged(object, type, path, data, key) {
        switch (type) {
            case 'edit-value':
                updateObject('edit-value', object, path, data);
                break;
            case 'edit-key':
                updateObject('edit-key', object, path, null, key, data);
                break;
            case 'add-value':
                updateObject('add-value', object, path);
                break;
            case 'add-object':
                updateObject('add-object', object, path, data, null, key);
                break;
            default:
                throw 'unknown type';
        }
    }

    function updateObject(type, object, path, newValue, oldKey, newKey){
        var stack = path.split('.');
        if (stack[0] === '') {
            stack.splice(0, 1);
        }

        while(stack.length > 1){
            object = object[stack.shift()];
        }

        switch (type) {
            case 'edit-value':
                object[stack.shift()] = newValue;
                break;
            case 'edit-key':
                object = object[stack.shift()];
                object[newKey] = object[oldKey];
                delete object[oldKey];
                break;
            case 'add-value':
                object[stack.shift()].push('');
                break;
            case 'add-object':
                object = object[stack.shift()];
                if (angular.isArray(object)) {
                    object.push(jQuery.extend(true, {}, newValue));
                } else {
                    object[newKey] = jQuery.extend(true, {}, newValue);
                }
                break;
            default:
                throw 'unknown type';
        }
    }
})();
