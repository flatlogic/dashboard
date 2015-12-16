(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .factory('eventBus', eventBus);

    /**
     *
     */
    function eventBus(EVENTS_URL, $rootScope) {
        var self = {
            initConnection: initConnection
        };

        /**
         *
         */
        function initConnection() {
            self.connection = self.connection || new EventSource(EVENTS_URL);

            self.connection.addEventListener('Event', function(event){
                var eventType = JSON.parse(event.data).type;

                $rootScope.$broadcast('eventBus:all', event);
                $rootScope.$broadcast('eventBus:' + eventType, event);
            });
        }

        return self;
    }

})();
