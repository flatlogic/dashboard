describe('Service: authenticationService', function() {
    var authenticationService, httpBackend;

    var token = 'token',
        domain = 'blinker.com';

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module("qorDash.loaders"));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("AUTH_API_URL", "https://accounts.qor.io/v1");
    }));

    beforeEach(function() {
        inject(function (_authenticationService_, $httpBackend, _dataLoader_, _user_, $state) {
            authenticationService = _authenticationService_;
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


    it("should get a list of domains", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('GET', /.*\/v1\/admin\/domain\//).respond(
            [
                {
                    "domain": "blinker.com",
                    "version": 0
                },
                {
                    "domain": "qor.io",
                    "version": 0
                }
            ]
        );

        authenticationService.getDomains()
            .success(function(response) {
                expect(response).toBeDefined();
                expect(response[0].domain).toEqual('blinker.com');
                expect(response[1].domain).toEqual('qor.io');
                done();
            });

        httpBackend.flush();
    });

    it("should get domain info by id", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('GET', /.*\/v1\/admin\/domain\/.*/, undefined, {"Authorization":"Bearer " + token,"Accept":"application/json"}).respond(
            {
                "domain": "blinker.com"
            }
        );

        authenticationService.getDomainInfo(domain, token)
            .success(function(response) {
                expect(response).toBeDefined();
                expect(response.domain).toEqual(domain);
                done();
            });

        httpBackend.flush();
    });

    it("should save changes", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('POST', /.*\/v1\/admin\/domain\/.*/).respond(
            {
                "domain": "blinker.com"
            }
        );
        done();
        //TODO after getting more specifications
    });
});