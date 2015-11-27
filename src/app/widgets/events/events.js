(function () {
    'use strict';

    angular
        .module('qorDash.widget.events')
        .directive('qlEvents', qlEvents)
        .controller('EventsController', eventsController);

    function qlEvents($timeout, $window) {
        var adaptHeight = function (element) {
            element.height(element.parent().parent().parent().height());
        };

        return {
            link: function (scope, element, attrs, ctrl) {
                $timeout(function () {
                    adaptHeight(element);
                    scope.onresize = function () {
                        adaptHeight(element);
                    };
                    angular.element($window).bind('resize', function () {
                        scope.onresize();
                    });
                });
            }
        }
    }

    function eventsController ($scope, $rootScope, $timeout) {
        $scope.events = [];

        /**
         * Listener for new messages from server
         * @param event Raw JSON from server response
         */
        var _socketMessage = function (event) {
            _addEvent(event.data);

            var sheetContent = angular.element('#events').parents('.qor-sheet-content')[0];
            sheetContent.scrollTop = sheetContent.scrollHeight
        };

        /**
         * Add event to list
         * @param event
         */
        var _addEvent = function (event) {
            $scope.$apply(function () {
                $scope.events.push(JSON.parse(event));
            });
        }

        /**
         * Check that url is valid WebSocket url
         * @param urlToCheck string URL
         * @return boolean true - if url is WebSocket and false if not
         */
        var _checkWsUrl = function(urlToCheck) {
            var urlParser = document.createElement('a');

            urlParser.href = urlToCheck;

            return (urlParser.protocol == 'ws:' || urlParser.protocol == 'wss:');
        };

        /**
         * Function for creating WS or ES object to url
         * @param connectionUrl
         * @returns {*} Socket object or null if can't connect
         */
        var _createConnection = function(connectionUrl) {
            var socketObject;

            try {
                if (_checkWsUrl(connectionUrl)) {
                    socketObject = new WebSocket(connectionUrl);
                    socketObject.onmessage = _socketMessage;
                } else {
                    socketObject = new EventSource(connectionUrl);
                    socketObject.addEventListener('Event', _socketMessage);
                }
            } catch(e) {
                return null;
            }

            return socketObject;
        };

        $scope.$watch('wsUrl', function (url) { // waiting for wsUrl to be set from the outside
            if (!url) return;
            $scope._socketObject = _createConnection($scope.wsUrl);
        });

        $rootScope.$on('events:newWsUrl', function (event, newUrl) {
            if ($scope._socketObject) {
                $scope._socketObject.close();
            }
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.events = [];
                    $scope.allMessages = {};
                });
            });
            $scope._socketObject = _createConnection(newUrl);
        });

        $scope.$on("$destroy", function () {
            if ($scope._socketObject) {
                $scope._socketObject.close();
            }
        });

    }
})();
