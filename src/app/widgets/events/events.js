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

    function eventsController ($scope, $rootScope) {
        $scope.events = [];

        /**
         * Listener for new messages from server
         * @param event Raw JSON from server response
         */
        var handleEvent = function (e, event) {
            addEventToDOM(event.data);

            var sheetContent = angular.element('#events').parents('.qor-sheet-content')[0];
            sheetContent.scrollTop = sheetContent.scrollHeight
        };

        /**
         * Add event to list
         * @param event
         */
        var addEventToDOM = function (event) {
            $scope.$apply(function () {
                $scope.events.push(JSON.parse(event));
            });
        }

        $scope.removeSubscription = $rootScope.$on('eventBus:all', handleEvent);

        $scope.$on("$destroy", function () {
            $scope.removeSubscription();
        });
    }
})();
