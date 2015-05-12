'use strict';

/* Services */

// Define your services here if necessary
var appServices = angular.module('app.services', []);

/**
 * Authorization service for working with token.
 * @param $window
 */
var authService = function($window) {
    var self = this;

    // Key to store and access token in localstorage
    self.tokenKey = 'authToken';

    self.saveToken = function(token) {
        $window.localStorage[self.tokenKey] = token;
    }

    self.getToken = function() {
        return $window.localStorage[self.tokenKey];
    }

    self.removeToken = function() {
        $window.localStorage.removeItem(self.tokenKey);
    }

    /**
     * Convert token from JWT format to an object
     * @returns {object} JSON object contains token info or empty object
     */
    self.getParsedToken = function() {
        var token = self.getToken();
        if (!token) {
            return false;
        }

        // Decode from base64
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');

        var parsedToken = JSON.parse($window.atob(base64));
        return parsedToken;
    }
};

// Add authService as auth
appServices.service('auth', authService);

/**
 * Service for working with user authentication
 * @param $http angular http service
 * @param API_URL link to REST api
 * @param auth authorization service
 */
var userService = function($http, API_URL, auth, dataLoader) {
    var self = this;

    self.isAuthed = function() {
        var token = auth.getParsedToken();
        if(token) {
            // Check token expiration
            return Math.round(new Date().getTime() / 1000) <= token.exp;
        } else {
            return false;
        }
    }

    // Get all user permissions in one array of strings
    self.getPermissions = function() {
        var token = auth.getParsedToken();
        if (token) {
            return token['passport/@scopes'].split(',');
        } else {
            return [];
        }
    }

    self.login = function(username, password) {
        var request = {
            method: 'POST',
            url:    API_URL + '/auth',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                username : username,
                password : password
            }
        };

        return $http(request)
            .success(function(response) {
                if (response.token) {
                    auth.saveToken(response.token);
                }
                return response;
            })
            .error(function(error) {
                return error;
            });
    };

    self.hasAccessTo = function(itemName) {
        var currentUserPermissions = self.getPermissions();
        var globalPermissions = dataLoader.getGlobalPermissionsObject();

        var neededPermission = globalPermissions[itemName];

        if (neededPermission) {
            return currentUserPermissions.indexOf(neededPermission) != -1;
        } else {
            return false;
        }
    }

    self.logout = function() {
        auth.removeToken();
    }
};

// Add userService as user
appServices.service('user', userService);

/**
 * Service for loading JSON scripts from server
 */
var dataLoaderService = function($window, $http, API_URL) {
    var self = this;

    // Key to store permissions in localstorage
    self.permissionsJsonKey = 'permissions_json';

    self.isPermissionJsonAvailable = function() {
        return $window.localStorage[self.permissionsJsonKey] ? true : false;
    }

    // Load and save json with permission map
    self.loadPermissionsJson = function() {
        return $http.get('data/permissions.json')
            .then(function(result) {
                $window.localStorage[self.permissionsJsonKey] = JSON.stringify(result.data);
            });
    }

    /**
     * Load json with sections which should be displayed on specified page
     */
    self.loadPageSections = function(pageName) {
        return $http.get('data/sections-' + pageName + '.json')
            .then(function(result) {
                $window.localStorage['sections_' + pageName] = JSON.stringify(result.data);
            }, function() {
                $window.localStorage['sections_' + pageName] = '[]';
            });
    };

    self.getGlobalPermissionsObject = function() {
        return JSON.parse($window.localStorage[self.permissionsJsonKey] || '{}');
    }

    self.getPageSections = function(pageName) {
        return JSON.parse( $window.localStorage['sections_' + pageName] || '{}');
    }

    /**
     * Download and save all scripts. Called in page controller.
     */
    self.init = function(pageName) { // fixme returns one promise
        return self.loadPermissionsJson().then(function(){
            return self.loadPageSections(pageName);
        });
    }
};

appServices.service('dataLoader', dataLoaderService);


appServices.factory('WebSocket', function ($websocket) {
        //var ws = $websocket.$new('ws://localhost:8080'); // instance of ngWebsocket, handled by $websocket service
        //
        //ws.$on('$open', function () {
        //    console.log('Oh my gosh, websocket is really open! Fukken awesome!');
        //
        //    ws.$emit('ping', 'hi listening websocket server'); // send a message to the websocket server
        //
        //    var data = {
        //        level: 1,
        //        text: 'ngWebsocket rocks!',
        //        array: ['one', 'two', 'three'],
        //        nested: {
        //            level: 2,
        //            deeper: [
        //                {
        //                    hell: 'yeah'
        //                },
        //                {
        //                    so: 'good'
        //                }
        //            ]
        //        }
        //    };
        //
        //    ws.$emit('pong', data);
        //});
        //
        //ws.$on('pong', newData);
        //
        //ws.$on('$close', function () {
        //    console.log('Noooooooooou, I want to have more fun with ngWebsocket, damn it!');
        //});

        function newData(data) {
            console.log('The websocket server has sent the following data:');
            console.log(data);
            return data;
        }

        var methods = {
            new_data: newData
        }

        return methods;
    }
);


/**
 * Override default angular exception handler to log and alert info if debug mode
 */
appServices.factory('$exceptionHandler', function ($log) {
    return function (exception, cause) {
        var errors = JSON.parse(localStorage.getItem('sing-angular-errors')) || {};
        errors[new Date().getTime()] = arguments;
        localStorage.setItem('sing-angular-errors', JSON.stringify(errors));
        app.debug && $log.error.apply($log, arguments);
        app.debug && alert('check errors');
    };
});

/**
 * Sing Script loader. Loads script tags asynchronously and in order defined in a page
 */
appServices.factory('scriptLoader', ['$q', '$timeout', function($q, $timeout) {

    /**
     * Naming it processedScripts because there is no guarantee any of those have been actually loaded/executed
     * @type {Array}
     */
    var processedScripts = [];
    return {
        /**
         * Parses 'data' in order to find & execute script tags asynchronously as defined.
         * Called for partial views.
         * @param data
         * @returns {*} promise that will be resolved when all scripts are loaded
         */
        loadScriptTagsFromData: function(data) {
            var deferred = $q.defer();
            var $contents = $($.parseHTML(data, document, true)),
                $scripts = $contents.filter('script[data-src][type="text/javascript-lazy"]').add($contents.find('script[data-src][type="text/javascript-lazy"]')),
                scriptLoader = this;

            scriptLoader.loadScripts($scripts.map(function(){ return $(this).attr('data-src')}).get())
                .then(function(){
                    deferred.resolve(data);
                });

            return deferred.promise;
        },


        /**
         * Sequentially and asynchronously loads scripts (without blocking) if not already loaded
         * @param scripts an array of url to create script tags from
         * @returns {*} promise that will be resolved when all scripts are loaded
         */
        loadScripts: function(scripts) {
            var previousDefer = $q.defer();
            previousDefer.resolve();
            scripts.forEach(function(script){
                if (processedScripts[script]){
                    if (processedScripts[script].processing){
                        previousDefer = processedScripts[script];
                    }
                    return
                }

                var scriptTag = document.createElement('script'),
                    $scriptTag = $(scriptTag),
                    defer = $q.defer();
                scriptTag.src = script;
                defer.processing = true;

                $scriptTag.load(function(){
                    $timeout(function(){
                        defer.resolve();
                        defer.processing = false;
                        Pace.restart();
                    })
                });

                previousDefer.promise.then(function(){
                    document.body.appendChild(scriptTag);
                });

                processedScripts[script] = previousDefer = defer;
            });

            return previousDefer.promise;
        }
    }
}]);