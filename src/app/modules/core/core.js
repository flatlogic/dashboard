(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .controller('App', AppController)
        .service('dataLoader', dataLoaderService)
        .run(runCore)
        .factory('jQuery', jQueryService)
        .factory('pubSub', pubSubService)
        .factory('errorHandler', errorService);

    AppController.$inject = ['config', '$scope', '$qorSidebar'];
    function AppController(config, $scope, $qorSidebar) {
        /*jshint validthis: true */
        var vm = this;

        vm.title = config.appTitle;
        vm.toggleSidebar = toggleSidebar;

        $scope.app = config;

        function toggleSidebar() {
            $qorSidebar.toggleSidebar();
        }
    }

    runCore.$inject = ['dataLoader'];
    function runCore(dataLoader) {
        dataLoader.loadGlobalPermissions();
    }


    function pubSubService() {
        var self = this;

        self.messages = {};
        var hOp = self.messages.hasOwnProperty;

        return {
            subscribe: function(messageType, listener) {
                if (!hOp.call(self.messages, messageType)) self.messages[messageType] = [];

                var index = self.messages[messageType].push(listener) - 1;

                return {
                    remove: function() {
                        delete self.messages[messageType][index];
                    }
                }
            },

            publish: function(messageType, message) {
                if (!hOp.call(self.messages, messageType)) return;

                self.messages[messageType].forEach(function(item){
                    item(message ? info : {});
                });
            }
        }
    }

    /**
     * Service for loading JSON scripts from server
     */
    dataLoaderService.$inject = ['$window', '$http', '$q'];
    function dataLoaderService($window, $http, $q) {
        var self = this;

        // Key to store permissions in localstorage
        self.permissionsJsonKey = 'permissions_json';

        // Load and save json with permission map
        self.loadGlobalPermissions = function () {
            return $http.get('data/permissions.json')
                .then(function (result) {
                    $window.localStorage[self.permissionsJsonKey] = JSON.stringify(result.data);
                    return result.data;
                });
        };

        /**
         * Load json with sections which should be displayed on specified page
         */
        self.loadPageSections = function (pageName) {
            var emptySections = [];
            return $http.get('data/sections-' + pageName + '.json')
                .then(function (result) {
                    $window.localStorage['sections_' + pageName] = JSON.stringify(result.data);
                    return result.data;
                }, function () {
                    $window.localStorage['sections_' + pageName] = JSON.stringify(emptySections);
                    return emptySections;
                });
        };

        self.getGlobalPermissions = function () {
            if (!$window.localStorage[self.permissionsJsonKey]) {
                throw new Error('No global permissions loaded. Ensure that dataLoader.loadGlobalPermission has been called first');
            }
            return JSON.parse($window.localStorage[self.permissionsJsonKey]);
        };

        self.getPageSections = function (pageName) {
            if (!$window.localStorage['sections_' + pageName]) {
                return self.loadPageSections(pageName);
            }
            return $q(function (resolve) {
                resolve(JSON.parse($window.localStorage['sections_' + pageName]));
            });
        };

        /**
         * Download and save all scripts. Called in page controller.
         */
        self.init = function (pageName) {
            return self.loadGlobalPermissions().then(function () {
                //return self.loadPageSections(pageName);
            });
        }
    }

    jQueryService.$inject = ['$window'];

    function jQueryService($window) {
        return $window.jQuery; // assumes jQuery has already been loaded on the page
    }

    /**
     * Error service
     */
    errorService.$inject = ['Notification'];
    function errorService(Notification){
        return {
            showError: function(response){
                // TODO: improve error handling, current one may not cover some use cases
                var error = response ? response.data ? response.data.error : 'unknown server error' : 'unknown error';
                Notification.error('Can\'t load data: ' + error);
                return error;
            }
        };
    }


})();
