(function () {
    'use strict';

    angular
        .module('qorDash.auth.permissions')
        .service('permissions', permissionsService);

    function permissionsService($q, $window, USER_HAS_NO_ACCESS) {

        // TODO: log_details is unknown state. maybe we should remove it
        var current = null,
            permissionsKey = 'userPermissions',
            statesWhiteList = ['login', 'logout', 'log_details'];

        function map(data) {
            var map = {};
            for (var i = 0; i < data.length; i++) {
                map[data[i].resource] = data[i].permissions;
            }
            return map;
        }

        function clear() {
            current = null;
            $window.localStorage.removeItem(permissionsKey);
        }

        function save(response) {
            current = null;
            var permissions = response.data && response.data.acls ? map(response.data.acls) : null;
            $window.localStorage.setItem(permissionsKey, JSON.stringify(permissions));
        }

        function parse() {
            current = JSON.parse($window.localStorage.getItem(permissionsKey));
            return current;
        }

        function resolveState(state) {
            return hasAccess(state) || $q.reject(USER_HAS_NO_ACCESS);
        }

        function hasAccess(state, action) {
            if (statesWhiteList.indexOf(state) >= 0){
                return true;
            }
            action = action || 'read';
            var userPermission = current || parse();
            var app = /\./.test(state) ? state.split('.')[1] : state;
            var hasPermission = userPermission[app] && userPermission[app].indexOf(action) >= 0;
            return !!hasPermission;
        }

        return {
            map: map,
            save: save,
            parse: parse,
            clear: clear,
            hasAccess: hasAccess,
            resolveState: resolveState
        }
    }
})();
