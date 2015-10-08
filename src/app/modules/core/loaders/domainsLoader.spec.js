describe('Service: domainsLoader', function() {
    var domainsLoader, httpBackend;

    var serverResponse = 'response',
        API_URL = 'API_URL';

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module("qorDash.loaders"));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("API_URL", API_URL);
    }));

    beforeEach(function() {
        inject(function (_domainsLoader_, $httpBackend, _dataLoader_, _user_, $state) {
            domainsLoader = _domainsLoader_;
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


    it("should get a domain info by id", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('GET', API_URL + '/v1/domain/').respond(serverResponse);

        domainsLoader.load()
            .success(function(response) {
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });
});