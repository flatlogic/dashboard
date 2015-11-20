describe('Factory: errorHandler ', function() {
    var errorHandler, httpBackend;

    var UNKNOWN_ERROR = 'UNKNOWN_ERROR',
        UNKNOWN_SERVER_ERROR = 'UNKNOWN_SERVER_ERROR',
        Notification = {error: function(){}},
        error,
        response,
        showError;

    beforeEach(function(){
        module('ui.router');
        module('qorDash.config');
        module('qorDash.core');
        module('qorDash.auth');
    });

    beforeEach(module('qorDash.core', function($provide) {
        $provide.constant("UNKNOWN_ERROR", UNKNOWN_ERROR);
        $provide.constant("UNKNOWN_SERVER_ERROR", UNKNOWN_SERVER_ERROR);
        $provide.constant("Notification", Notification);
    }));

    beforeEach(function() {
        inject(function (_errorHandler_, $state) {
            errorHandler = _errorHandler_;
            spyOn($state, 'go').and.returnValue(true);
            spyOn(Notification, 'error').and.returnValue(true);
        });
    });

    describe('when response is a string', function(){
        it('should error populate with response', function(){
            response = 'string';
            errorHandler.showError(response);
            expect(Notification.error).toHaveBeenCalledWith('Can\'t load data: ' + response);
        });
    });

    describe('when response has property data', function(){
        it('should error populate with response.data.error', function(){
            response = {data: {error: UNKNOWN_SERVER_ERROR}};
            errorHandler.showError(response);
            expect(Notification.error).toHaveBeenCalledWith('Can\'t load data: ' + UNKNOWN_SERVER_ERROR);
        });
    });

    describe('when response is not a string and does not have property data', function(){
        it('should error populate with UNKNOWN_ERROR', function(){
            response = 123;
            errorHandler.showError(response);
            expect(Notification.error).toHaveBeenCalledWith('Can\'t load data: ' + UNKNOWN_ERROR);
        });
    });
});
