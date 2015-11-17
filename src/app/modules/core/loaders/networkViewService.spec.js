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
            $provide.constant('resolvedNetworkData', '');
            $provide.constant('Notification', '');
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
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });
});
