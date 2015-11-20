describe('Service: manageLoader', function() {
    var manageLoader, httpBackend;

    var resultToken = 'token',
        serverResponse = { token: resultToken },
        AUTH_API_URL = 'AUTH_API_URL',
        AUTH_API_USER = 'AUTH_API_USER',
        AUTH_API_SECRET = 'AUTH_API_SECRET',
        errorHandler = 'errorHandler';

    beforeEach(function() {
        module('ui.router');
        module('qorDash.api');

        module(function($provide) {
            $provide.constant('AUTH_API_URL', AUTH_API_URL);
            $provide.constant('AUTH_API_USER', AUTH_API_USER);
            $provide.constant('AUTH_API_SECRET', AUTH_API_SECRET);
            $provide.constant('errorHandler', errorHandler);
        });
    });

    beforeEach(function() {
        inject(function (_manageLoader_, $httpBackend) {
            manageLoader = _manageLoader_;
            httpBackend = $httpBackend;
        });
    });


    it("should get token", function(done) {
        httpBackend.expect('POST', AUTH_API_URL + '/auth', {
            'username': AUTH_API_USER,
            'password': AUTH_API_SECRET
        }).respond(serverResponse);

        manageLoader.load().then(function(response) {
            expect(response).toEqual(resultToken);
            done();
        });

        httpBackend.flush();
    });
});
