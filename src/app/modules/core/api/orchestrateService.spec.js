describe('Service: orchestrateService', function() {
    var orchestrateService, httpBackend;

    var domain = 'domain',
        instance = 'instance',
        option = 'option',
        optionId = 'optionId',
        serverResponse = 'response',
        activateUrl = 'activateUrl',
        data = 'data',
        API_HOST = 'API_HOST';

    beforeEach(function(){
        module("qorDash.api");
        module(function($provide) {
            $provide.constant("API_HOST", API_HOST);
        });
    });

    beforeEach(function() {
        inject(function (_orchestrateService_, $httpBackend) {
            orchestrateService = _orchestrateService_;
            httpBackend = $httpBackend;
        });
    });


    it("should load history", function(done) {
        httpBackend.expect('GET', API_HOST + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/')
            .respond(serverResponse);

        orchestrateService.loadHistory(domain, instance, option)
            .then(function(response) {
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it("should load instances", function(done) {
        httpBackend.expect('GET', API_HOST + '/v1/orchestrate/'+ domain +'/'+ instance +'/')
            .respond(serverResponse);

        orchestrateService.loadInstances(domain, instance)
            .then(function(response) {
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it("should load option by id", function(done) {
        httpBackend.expect('GET', API_HOST + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/' + optionId)
            .respond(serverResponse);

        orchestrateService.loadOption(domain, instance, option, optionId)
            .then(function(response) {
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it("should load log url", function(done) {
        httpBackend.expect('POST', API_HOST + activateUrl, data)
            .respond(serverResponse);

        orchestrateService.loadLogUrl(activateUrl, data)
            .then(function(response) {
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });
});
