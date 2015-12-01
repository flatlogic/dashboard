(function () {
    'use strict';

    angular
        .module('qorDash.auth.permissions')
        .factory('permissions', permissionsService);

    function permissionsService($q, auth, USER_HAS_NO_ACCESS) {
        // TODO: log_details is unknown state. maybe we should remove it
        var statesWhiteList = ['login', 'logout', 'log_details'];
        var _userPermissions = _createPermissionsMap();

        function _createPermissionsMap() {
            var token = auth.getParsedToken();
            var permissions = {};
            for (var prop in token) {
                if ((/^((?!passport|redpill).)*\/@scopes$/i).test(prop)){
                    var app = prop.split('/')[0];
                    var scopes = token[prop].split(',');
                    permissions[app] = scopes;
                }
            }
            return Object.keys(permissions).length > 0 ? permissions : null;
        };

        function hasAccess(state, action) {
            if (statesWhiteList.indexOf(state) >= 0){
                return true;
            }
            action = action || 'read';
            _userPermissions = _userPermissions || _createPermissionsMap();
            var app = /\./.test(state) ? state.split('.')[1] : state;
            var hasPermission = _userPermissions[app] && _userPermissions[app].indexOf(action) >= 0;
            return !!hasPermission;
        }

        function resolveState(state){
            return true;
            // TODO: temporary disabled
            //return hasAccess(state) || $q.reject(USER_HAS_NO_ACCESS);
        }

        return {
            _userPermissions: _userPermissions,
            _createPermissionsMap: _createPermissionsMap,
            resolveState: resolveState,
            hasAccess: hasAccess
        };
    }
})();
