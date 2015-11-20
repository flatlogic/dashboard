describe('Factory: errorHandler ', function() {
    var errorHandler, httpBackend;

    var UNKNOWN_ERROR = 'UNKNOWN_ERROR',
        UNKNOWN_SERVER_ERROR = 'UNKNOWN_SERVER_ERROR',
        Notification,
        response;

    beforeEach(function(){
        module('qorDash.core');
        module(function($provide) {
            $provide.constant("UNKNOWN_ERROR", UNKNOWN_ERROR);
            $provide.constant("UNKNOWN_SERVER_ERROR", UNKNOWN_SERVER_ERROR);
            $provide.service("Notification", function(){
                this.error = jasmine.createSpy('error').and.callFake(function(){});
            });
        })
    });

    beforeEach(function() {
        inject(function (_errorHandler_, _Notification_) {
            Notification = _Notification_;
            errorHandler = _errorHandler_;
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
