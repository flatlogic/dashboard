describe('Service: manageLoader', function() {
    var manageLoader, httpBackend;

    var resultToken = 'token',
        serverResponse = { token: resultToken },
        AUTH_API_URL = 'AUTH_API_URL',
        AUTH_API_USER = 'AUTH_API_USER',
        AUTH_API_SECRET = 'AUTH_API_SECRET';

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module("qorDash.loaders"));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("AUTH_API_URL", AUTH_API_URL);
        $provide.constant("AUTH_API_USER", AUTH_API_USER);
        $provide.constant("AUTH_API_SECRET", AUTH_API_SECRET);
    }));

    beforeEach(function() {
        inject(function (_manageLoader_, $httpBackend, _dataLoader_, _user_, $state) {
            manageLoader = _manageLoader_;
            httpBackend = $httpBackend;

            spyOn(_dataLoader_, 'init').and.returnValue({
                then: function (next) {
                    next && next()
                }
            });
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);

            spyOn($state, 'go').and.returnValue(true);
        });
    });


    it("should get token", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
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