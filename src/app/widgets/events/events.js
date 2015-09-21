(function () {
    'use strict';

    var eventsModule = angular.module('qorDash.widget.events')
            .directive('qlEvents', qlEvents)
        ;

    qlEvents.$inject = ['$timeout', '$window'];
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

    var timelineController = angular.createAuthorizedController('EventsController', ['$scope', '$rootScope', '$timeout', 'terminal', function ($scope, $rootScope, $timeout, terminal) {
        // List of all events
        $scope.events = [];

        var socketMessage = function (event) {
            parseInput(event.data);

            var sheetContent = angular.element('#events').parents('.qor-sheet-content')[0];
            sheetContent.scrollTop = sheetContent.scrollHeight
        };

        // Get EventSource url from attribute
        var es = new EventSource($scope.wsUrl);

        es.addEventListener('Event', socketMessage);

        $rootScope.$on('events:newWsUrl', function (event, newUrl) {
            es.close();
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.events = [];
                    $scope.allMessages = {};
                });
            });
            try {
                es = new EventSource(newUrl);
                es.addEventListener('Event', socketMessage);
            } catch (e) {
                alert('Wrong WebSocket url' + e);
            }
        });

        $scope.$on("$destroy", function () {
            es.close();
        });

        function parseInput(input) {
            $scope.$apply(function () {
                $scope.events.push(JSON.parse(input));
            });
        }
    }]);

    eventsModule.controller(timelineController);

})();
