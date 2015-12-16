describe('Factory: eventBus ', function() {
    var eventBus;

    beforeEach(function(){
        module('qorDash.core');
        module(function($provide) {
            $provide.constant("EVENTS_URL", 'events url');
        });
    });
    beforeEach(inject(function(_eventBus_){
        eventBus = _eventBus_;
    }));

    describe('init', function(){
        it('defines property connection', function(){
            expect(eventBus.connection).toBeDefined();
        });
    });
});
