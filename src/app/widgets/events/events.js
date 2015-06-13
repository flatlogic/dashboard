(function() {
    'use strict';

    var eventsModule = angular.module('qorDash.widget.events')
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

    var timelineController = angular.createAuthorizedController('EventsController', ['$scope', '$rootScope', '$timeout', 'terminal', function($scope, $rootScope, $timeout, terminal) {
        // List of all events
        $scope.events = [];

        var socketMessage = function(event) {
            parseInput(event.data);

          var sheetContent = angular.element('#events').parents('.qor-sheet-content')[0];
          sheetContent.scrollTop = sheetContent.scrollHeight
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

        $scope.$on("$destroy", function(){
            ws.close();
        });

        function parseInput(input) {
            $scope.$apply(function() {
                $scope.events.push(JSON.parse(input));
            });
        }
    }]);

    eventsModule.controller(timelineController);

})();
