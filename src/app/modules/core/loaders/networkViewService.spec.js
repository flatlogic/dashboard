describe('Service: networkViewService', function() {
    var networkViewService, httpBackend,
        serverResponse = 'response';

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module("qorDash.loaders"));

    beforeEach(function() {
        inject(function (_networkViewService_, $httpBackend, _dataLoader_, _user_, $state) {
            networkViewService = _networkViewService_;
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


    it("should load data for network view", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('GET', 'data/network-data.json').respond(serverResponse);

        networkViewService.load()
            .then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });
});
