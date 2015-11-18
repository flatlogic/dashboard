(function () {
    'use strict';

    angular
        .module('qorDash.auth.permissions', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider.decorator('views', function(state, parent) {
            var result = {},
            views = parent(state);
            angular.forEach(views, function(config, name) {
                config.resolve = config.resolve || {};
                config.resolve.resolvedPermissions = ['permissions', function(permissions) {
                    return permissions.resolveState(state.name);
                }];
                result[name] = config;
            });
            return result;
        });
    }
})();
