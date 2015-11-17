describe('Service: networkViewService', function() {
    var networkViewService, httpBackend,
        serverResponse = 'response';

    beforeEach(function() {
        module('ui.router');
        module('qorDash.core');
        module('qorDash.auth');
        module("qorDash.loaders");
        module(function($provide){
            $provide.constant('AUTH_API_URL', 'api url');
        });
    });

    beforeEach(function() {
        inject(function (_networkViewService_, $httpBackend, $state, AUTH_API_URL) {
            networkViewService = _networkViewService_;
            httpBackend = $httpBackend;

            spyOn($state, 'go').and.returnValue(true);
        });
    });


    it("should load data for network view", function(done) {
        httpBackend.expect('GET', 'data/network-data.json').respond(serverResponse);

        networkViewService.load()
            .then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });
});
