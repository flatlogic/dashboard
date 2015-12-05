(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .factory('eventBus', eventBus);

    /**
     *
     */
    function eventBus(EVENTS_URL, pubSub) {
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

                pubSub.publish('eventBus:all', event);
                pubSub.publish('eventBus:' + eventType, event);
            });
        }

        return self;
    }

})();
