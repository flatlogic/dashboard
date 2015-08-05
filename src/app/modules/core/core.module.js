(function () {
    'use strict';

    var core = angular.module('qorDash.core', [
        'ui.router',
        'ngAnimate',
        'ngSanitize'
    ]);

    core.config(appConfig);

    appConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function appConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'app/modules/core/app.html'
            });

        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            $state.go('app.dashboard');
        });
    }

    /**
     * Create controller with automatic authorization check
     * @param controllerName
     * @param controllerDef
     * @returns {{}}
     */

    angular.createAuthorizedController = function (controllerName, controllerDef) {
        var oldControllerFunc = controllerDef[controllerDef.length - 1];

        controllerDef[controllerDef.length - 1] = 'dataLoader';
        controllerDef.push('user');

        controllerDef.push(function () {
            var dataLoader = arguments[arguments.length - 2];
            var user = arguments[arguments.length - 1];

            if (!user.hasAccessTo(controllerName) && !user.hasAccessTo(controllerName.replace('Controller', ''))) {
                throw 'Access exception in ' + arguments[0];
            }

            var self = this,
                selfArguments = arguments;
            dataLoader.init(controllerName).then(function () {
                oldControllerFunc.apply(self, selfArguments)
            });
        });

        var result = {};
        result[controllerName] = controllerDef;
        return result;
    }
})();
