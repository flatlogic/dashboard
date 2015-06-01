(function() {
    'use strict';

    var terminalModule = angular.module('qorDash.widget.events')
            .directive('qlEvents', qlEvents)
        ;

    qlEvents.$inject = ['$timeout', '$window'];
    function qlEvents($timeout, $window) {
        var adaptHeight = function(element) {
            element.height(element.parent().parent().parent().height());
        };

        return {
            link: function(scope, element, attrs, ctrl) {
                $timeout(function(){
                    adaptHeight(element);
                    scope.onresize = function() {
                        adaptHeight(element);
                    };
                    angular.element($window).bind('resize', function() {
                        scope.onresize();
                    });
                });
            }
        }
    }

    var eventsController = angular.createAuthorizedController('EventsController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
        // List of all events
        $scope.events = [];

        var socketMessage = function(event) {
            parseInput(event.data);
        } ;

        // Get WebSocket url from attribute
        var ws = new WebSocket($scope.wsUrl);

        // Handle messages from WebSocket
        ws.onmessage = socketMessage;

        $rootScope.$on('events:newWsUrl', function(event, newUrl) {
            ws.close();
            $timeout(function() {
                $scope.$apply(function () {
                    $scope.events = [];
                    $scope.allMessages = {};
                });
            });
            try {
                ws = new WebSocket(newUrl);
                ws.onmessage = socketMessage;
            } catch (e) {
                alert('Wrong WebSocket url' + e);
            }
        });

        function parseInput(input) {
            $scope.events.push(JSON.parse(input));

            // Auto scroll after adding new card
            var elem = document.getElementById('events');
            elem.scrollTop = elem.scrollHeight;
        }

    }]);

    terminalModule.controller(eventsController);
})();