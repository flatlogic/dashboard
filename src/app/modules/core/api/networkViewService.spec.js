describe('Service: networkViewService', function() {
    var networkViewService, httpBackend,
        serverResponse = 'response';

    beforeEach(function() {
        module('ui.router');
        module('qorDash.api');
        module(function($provide){
            $provide.constant('resolvedNetworkData', '');
            $provide.constant('Notification', '');
            $provide.constant('AUTH_API_URL', 'AUTH_API_URL');
            $provide.constant('errorHandler', 'AUTH_API_URL');
        });
    });

    beforeEach(function() {
        inject(function (_networkViewService_, $httpBackend) {
            networkViewService = _networkViewService_;
            httpBackend = $httpBackend;
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
