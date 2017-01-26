(function () {
    'use strict';

    angular
        .module('qorDash.auth.permissions')
        .service('permissions', permissionsService);

    function permissionsService($q, $window, USER_HAS_NO_ACCESS) {

        // TODO: log_details is unknown state. maybe we should remove it
        var self = this,
            statesWhiteList = ['login', 'logout', 'log_details'];

        this.current = null;
        this.storageKey = 'userPermissions';

        this.map = function(data){
            return data.reduce(function(map, item){
                map[item.resource] = item.permissions;
                return map;
            }, {});
        }

        this.clear = function(){
            self.current = null;
            $window.localStorage.removeItem(self.storageKey);
        }

        this.save = function(response){
            self.current = null;
            var permissions = response && response.data && response.data.acls ? self.map(response.data.acls) : null;
            if (permissions) {
                $window.localStorage.setItem(self.storageKey, JSON.stringify(permissions));
            }
        }

        this.get = function(){
            self.current = self.current || JSON.parse($window.localStorage.getItem(self.storageKey));
            return self.current;
        }

        this.resolveState = function(state){
            return self.hasAccess(state) || $q.reject(USER_HAS_NO_ACCESS);
        }

        this.hasAccess = function(state, action){
            //if (statesWhiteList.indexOf(state) >= 0){
            //    return true;
            //}
            //action = action || 'read';
            //var userPermission = self.get();
            //var app = /\./.test(state) ? state.split('.')[1] : state;
            //var hasPermission = userPermission && userPermission[app] && userPermission[app].indexOf(action) >= 0;
            return true;
        }
    }
})();
