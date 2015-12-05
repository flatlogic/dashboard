(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .controller('App', AppController)
        .factory('d3', d3Service)
        .factory('jQuery', jQueryService)
        .factory('pubSub', pubSubService)
        .run(coreRun);

    function coreRun(eventBus) {
        eventBus.initConnection();
    }

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
                    item(message ? message : {});
                });
            }
        }
    }

    /**
     * D3.js service
     * @returns {*}
     */
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

    function jQueryService($window) {
        return $window.jQuery; // assumes jQuery has already been loaded on the page
    }

})();
