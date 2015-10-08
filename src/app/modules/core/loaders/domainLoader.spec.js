describe('Service: domainLoader', function() {
    var domainLoader, httpBackend;

    var domainId = 'domainId',
        serverResponse = 'response',
        API_URL = 'API_URL';

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module("qorDash.loaders"));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("API_URL", API_URL);
    }));

    beforeEach(function() {
        inject(function (_domainLoader_, $httpBackend, _dataLoader_, _user_, $state) {
            domainLoader = _domainLoader_;
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
        httpBackend.expect('GET', API_URL + '/v1/domain/' + domainId).respond(serverResponse);

        domainLoader.load(domainId)
            .success(function(response) {
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });
});