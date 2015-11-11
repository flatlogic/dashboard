describe('Service: authenticationService', function() {
    var authenticationService, httpBackend;

    var token = 'token',
        domain = 'blinker.com',
        serverResponse = 'response',
        AUTH_API_URL;

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.constants'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module("qorDash.loaders"));

    beforeEach(function() {
        inject(function (_authenticationService_, $httpBackend, _user_, _AUTH_API_URL_, $state) {
            authenticationService = _authenticationService_;
            httpBackend = $httpBackend;
            AUTH_API_URL = _AUTH_API_URL_;
            spyOn($state, 'go').and.returnValue(true);
        });
    });


    it("should get a list of domains", function(done) {
        httpBackend.expect('GET', AUTH_API_URL + '/admin/domain/', undefined,
            {
                "Accept":"application/json",
                'Authorization': 'Bearer ' + token
            }
        ).respond(serverResponse);

        authenticationService.getDomains(token)
            .then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it("should get domain info by id", function(done) {
        httpBackend.expect('GET', AUTH_API_URL + '/admin/domain/' + domain, undefined, {"Authorization":"Bearer " + token,"Accept":"application/json"}).respond(serverResponse);

        authenticationService.getDomainInfo(domain, token)
            .then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });
});
