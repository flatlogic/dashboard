(function () {
    'use strict';

    angular
        .module('qorDash.auth.permissions')
        .directive('hasPermission', hasPermission);

    function hasPermission($state, permissions, ngIfDirective) {
        var ngIf = ngIfDirective[0];

        return {
            transclude: ngIf.transclude,
            priority: ngIf.priority - 1,
            terminal: ngIf.terminal,
            restrict: ngIf.restrict,
            link: function(scope, element, attributes) {
                var permissionString = attributes.hasPermission,
                    state,
                    action;

                if (permissionString.indexOf('.')>=0){
                    var arr = permissionString.split('.');
                    state = arr[0];
                    action = arr[1];
                } else {
                    state = $state.current.name;
                    action = permissionString;
                }
                // find the initial ng-if attribute
                var initialNgIf = attributes.ngIf, ifEvaluator;
                // if it exists, evaluates ngIf && hasPermission
                if (initialNgIf) {
                    ifEvaluator = function () {
                        return scope.$eval(initialNgIf) && permissions.hasAccess(state, action);
                    };
                } else { // if there's no ng-if, process normally
                    ifEvaluator = function () {
                        return permissions.hasAccess(state, action);
                    };
                }
                attributes.ngIf = ifEvaluator;
                ngIf.link.apply(ngIf, arguments);
            }
    };
}
})();
