(function () {
    'use strict';

    angular
        .module('qorDash.auth.permissions')
        .factory('permissions', permissionsService);

    function permissionsService($q, auth, USER_HAS_NO_ACCESS) {

        var _userPermissions = _createPermissionsMap();

        function _createPermissionsMap() {
            var token = auth.getParsedToken();
            var permissions = {};
            for (var prop in token) {
                if ((/^((?!passport|redpill).)*\/@scopes$/i).test(prop)){
                    var app = prop.split('/')[0];
                    var scopes = token[prop];
                    permissions[app] = scopes;
                }
            }
            return permissions;
        };

        function hasAccess(state, action) {
            if (!state){
                return false;
            }
            var app = state.split('.')[1];
            action = action || 'read';
            var hasPermission = _userPermissions[app] && _userPermissions[app].indexOf(action) >= 0;
            return !!hasPermission;
        }

        function resolveState(state){
            return hasAccess(state) || $q.reject(USER_HAS_NO_ACCESS);
        }

        return {
            _userPermissions: _userPermissions,
            _createPermissionsMap: _createPermissionsMap,
            resolveState: resolveState,
            hasAccess: hasAccess
        };
    }
})();
