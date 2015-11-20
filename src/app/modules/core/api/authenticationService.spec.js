describe('Service: authenticationService', function() {
    var authenticationService, httpBackend;

    var token = 'token',
        domain = 'blinker.com',
        data = 'data',
        serverResponse = 'response',
        errorHandler = 'errorHandler',
        AUTH_API_URL = 'AUTH_API_URL';

    beforeEach(function() {
        module('ui.router');
        module('qorDash.api');

        module(function($provide) {
            $provide.constant("AUTH_API_URL", AUTH_API_URL);
            $provide.constant("Notification", {error: function(){}});
            $provide.constant("errorHandler", errorHandler);
        });
    });

    beforeEach(function() {
        inject(function (_authenticationService_, $httpBackend) {
            authenticationService = _authenticationService_;
            httpBackend = $httpBackend;
        });
    });


    it("should get a list of domains", function(done) {
        httpBackend.expect('GET', AUTH_API_URL + '/admin/domain/', undefined,
            {
                "Accept":"application/json, text/plain, */*",
                'Authorization': 'Bearer ' + token
            }
        ).respond(serverResponse);

        authenticationService.getDomains(token)
            .then(function(response) {
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it("should get domain info by id", function(done) {
        httpBackend.expect('GET', AUTH_API_URL + '/admin/domain/' + domain, undefined,
            {"Authorization":"Bearer " + token,"Accept":"application/json, text/plain, */*"}).respond(serverResponse);

        authenticationService.getDomainInfo(domain, token)
            .then(function(response) {
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it("should save domain info", function(done) {
        httpBackend.expect('POST', AUTH_API_URL + '/admin/domain/' + domain, data,
            {"Content-Type":"application/json;charset=utf-8",
                "Authorization":"Bearer " + token,"Accept":"application/json, text/plain, */*"}).respond(serverResponse);

        authenticationService.saveDomainInfo(domain, data, token)
            .then(function(response) {
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });
});
