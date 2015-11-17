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

    it('should error populate with response if response is a string', function(){
        response = 'string';
        errorHandler.showError(response);
        expect(Notification.error).toHaveBeenCalledWith('Can\'t load data: ' + response);
    });

    it('should error populate with response.data.error if response.data exists', function(){
        response = {data: {error: UNKNOWN_SERVER_ERROR}};
        errorHandler.showError(response);
        expect(Notification.error).toHaveBeenCalledWith('Can\'t load data: ' + UNKNOWN_SERVER_ERROR);
    });

    it('should error populate with UNKNOWN_ERROR in other case', function(){
        response = 123;
        errorHandler.showError(response);
        expect(Notification.error).toHaveBeenCalledWith('Can\'t load data: ' + UNKNOWN_ERROR);
    });

});
