describe('Service: orchestrateService', function() {
    var orchestrateService, httpBackend;

    var domain = 'domain',
        instance = 'instance',
        option = 'option',
        optionId = 'optionId',
        serverResponse = 'response',
        activateUrl = 'activateUrl',
        data = 'data';

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.config'));
    beforeEach(module('qorDash.core'));
    beforeEach(module("qorDash.loaders"));


    beforeEach(function() {
        inject(function (_orchestrateService_, $httpBackend, _API_URL_, _user_, $state) {
            orchestrateService = _orchestrateService_;
            httpBackend = $httpBackend;
            API_URL = _API_URL_;

            spyOn($state, 'go').and.returnValue(true);
        });
    });


    it("should load history", function(done) {
        httpBackend.expect('GET', API_URL + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/')
            .respond(serverResponse);

        orchestrateService.loadHistory(domain, instance, option)
            .then(function(response) {
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it("should load instances", function(done) {
        httpBackend.expect('GET', API_URL + '/v1/orchestrate/'+ domain +'/'+ instance +'/')
            .respond(serverResponse);

        orchestrateService.loadInstances(domain, instance)
            .then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it("should load option by id", function(done) {
        httpBackend.expect('GET', API_URL + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/' + optionId)
            .respond(serverResponse);

        orchestrateService.loadOption(domain, instance, option, optionId)
            .then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it("should load log url", function(done) {
        httpBackend.expect('POST', API_URL + activateUrl, data)
            .respond(serverResponse);

        orchestrateService.loadLogUrl(activateUrl, data)
            .then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });
});
