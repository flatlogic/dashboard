'use strict';

var singApp = angular.module('singApp', [
    // common essential modules
    'ngAnimate',
    'ngStorage',
    'ngResource',
    'ui.router',
    'ui.router.util',
    'ui.jq',
    'ui.event',
    'ui.bootstrap',
    'ngWebsocket',

    // page-specific and demo. may be removed
    'angular-bootstrap-select',
    'datatables',
    'datatables.bootstrap',
    'ui.calendar',

    // application libs
    'app.controllers',
    'app.services',
    'app.directives',
]);

singApp.config(function($stateProvider, $urlRouterProvider){

// For any unmatched url, send to /dashboard
    $urlRouterProvider.otherwise("/login");

    $stateProvider
        .state('app', {
            abstract: true,
            url: '/app',
            templateUrl: 'views/app.html'
        })

        .state("app.dashboard", {
            url: '/dashboard',
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController',
            authenticate: true
        })

        //separate state for login & error pages
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .state('error', {
            url: '/error',
            templateUrl: 'views/error.html'
        })
        .state('logout', {
            url: '/logout',
            controller: function($location, user) {
                user.logout();
                $location.path('/login');
            }
        });
});

/**
 * Authorization routing
 */
singApp.run(function ($rootScope, $state, user, dataLoader) {
    dataLoader.loadPermissionsJson();
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        // Go to login page if user is not authorized
        if (toState.authenticate && !user.isAuthed()) {
            $state.transitionTo("login");
            event.preventDefault();
            return;
        }
        // Go to 404 if user has no access to page controller
        if (toState.authenticate && toState.controller && !user.hasAccessTo(toState.controller)) {
            $state.transitionTo('error');
            event.preventDefault();
        }
    });
});

// Http interceptor for attaching token to headers
var authInterceptor = function(API_URL, auth) {
    return {
        // automatically attach Authorization header
        request: function(config) {
            var token = auth.getToken();
            if(token) {
                config.headers.Authorization = 'Bearer ' + token;
            }

            config.headers.Accept = "application/json";

            return config;
        },

        response: function(res) {
            return res;
        }
    }
}

singApp.factory('authInterceptor', authInterceptor);

singApp.config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});


singApp.constant('API_URL', 'https://accounts.qor.io/v1');

singApp.value('uiJqDependencies', {
    'mapael': [
        'vendor/raphael/raphael-min.js',
        'vendor/jQuery-Mapael/js/jquery.mapael.js'
    ],
    'easyPieChart': [
        'vendor/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js'
    ],
    'autosize': [
        'vendor/jquery-autosize/jquery.autosize.min.js'
    ],
    'wysihtml5': [
        'vendor/bootstrap3-wysihtml5/lib/js/wysihtml5-0.3.0.min.js',
        'vendor/bootstrap3-wysihtml5/src/bootstrap3-wysihtml5.js'
    ],
    'select2': [
        'vendor/select2/select2.min.js'
    ],
    'markdown': [
        'vendor/markdown/lib/markdown.js',
        'vendor/bootstrap-markdown/js/bootstrap-markdown.js'
    ],
    'datetimepicker': [
        'vendor/moment/min/moment.min.js',
        'vendor/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js'
    ],
    'colorpicker': [
        'vendor/mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js'
    ],
    'inputmask': [
        'vendor/jasny-bootstrap/js/inputmask.js'
    ],
    'fileinput': [
        'vendor/holderjs/holder.js',
        'vendor/jasny-bootstrap/js/fileinput.js'
    ],
    'slider': [
        'vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js'
    ],
    'parsley': [
        'vendor/parsleyjs/dist/parsley.min.js'
    ],
    'sortable': [
        'vendor/jquery-ui/ui/core.js',
        'vendor/jquery-ui/ui/widget.js',
        'vendor/jquery-ui/ui/mouse.js',
        'vendor/jquery-ui/ui/sortable.js',
        'vendor/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js'
    ],
    'draggable': [
        'vendor/jquery-ui/ui/core.js',
        'vendor/jquery-ui/ui/widget.js',
        'vendor/jquery-ui/ui/mouse.js',
        'vendor/jquery-ui/ui/draggable.js'
    ],
    'nestable': [
        'vendor/jquery.nestable/jquery.nestable.js'
    ],
    'vectorMap': [
        'vendor/jvectormap/jquery-jvectormap-1.2.2.min.js',
        'vendor/jvectormap-world/index.js'
    ],
    'sparkline': [
        'vendor/jquery.sparkline/index.js'
    ],
    'magnificPopup': [
        'vendor/magnific-popup/dist/jquery.magnific-popup.min.js'
    ],
    'ngWebsocket': [
        'vendor/ng-websocket/ng-websocket.js'
    ]
});