(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .controller('App', AppController)
        .service('dataLoader', dataLoaderService)
        .run(runCore)
        .factory('d3', d3Service)
        .factory('jQuery', jQueryService)
        .constant('API_URL', 'https://ops-dev.blinker.com');

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

    /**
     * D3.js service
     * @returns {*}
     */
    d3Service.$inject = ['$document', '$q', '$rootScope'];
    function d3Service($document, $q, $rootScope) {
        var d = $q.defer();

        function onScriptLoad() {
            // Load client in the browser
            function onScriptLoad1() {
                $rootScope.$apply(function () {
                    d.resolve(window.d3);
                });
            }

            var scriptTag = $document[0].createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            // TODO make local
            scriptTag.src = 'https://cdn.rawgit.com/Neilos/bihisankey/master/bihisankey.js';
            scriptTag.onreadystatechange = function () {
                if (this.readyState == 'complete') onScriptLoad1();
            };
            scriptTag.onload = onScriptLoad1;

            var s = $document[0].getElementsByTagName('body')[0];
            s.appendChild(scriptTag);
        }

        // Create a script tag with d3 as the source
        // and call our onScriptLoad callback when it
        // has been loaded
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        // TODO make local
        scriptTag.src = 'http://d3js.org/d3.v3.min.js';
        scriptTag.onreadystatechange = function () {
            if (this.readyState == 'complete') onScriptLoad();
        };
        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

        return {
            d3: function () {
                return d.promise;
            }
        };
    }

    jQueryService.$inject = ['$window'];

    function jQueryService($window) {
        return $window.jQuery; // assumes jQuery has already been loaded on the page
    }

})();
