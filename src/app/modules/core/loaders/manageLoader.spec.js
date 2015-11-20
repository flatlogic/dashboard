describe('Service: manageLoader', function() {
    var manageLoader, httpBackend;

    var resultToken = 'token',
        serverResponse = { token: resultToken },
        AUTH_API_URL,
        AUTH_API_USER,
        AUTH_API_SECRET;

    beforeEach(function() {
        module('ui.router');
        module('ui-notification');
        module('qorDash.config');
        module('qorDash.core');
        module("qorDash.loaders");
    });

    beforeEach(function() {
        inject(function (_manageLoader_, $httpBackend, _user_, $state, _AUTH_API_URL_, _AUTH_API_USER_, _AUTH_API_SECRET_) {
            manageLoader = _manageLoader_;
            httpBackend = $httpBackend;
            AUTH_API_URL = _AUTH_API_URL_;
            AUTH_API_USER = _AUTH_API_USER_;
            AUTH_API_SECRET = _AUTH_API_SECRET_;

            spyOn($state, 'go').and.returnValue(true);
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
