describe('Service: orchestrateService', function() {
    var orchestrateService, httpBackend;

    var domain = 'domain',
        instance = 'instance',
        option = 'option',
        optionId = 'optionId',
        serverResponse = 'response',
        activateUrl = 'activateUrl',
        data = 'data',
        API_URL = 'API_URL';

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module("qorDash.loaders"));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("API_URL", API_URL);
    }));

    beforeEach(function() {
        inject(function (_orchestrateService_, $httpBackend, _dataLoader_, _user_, $state) {
            orchestrateService = _orchestrateService_;
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


    it("should load history", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('GET', API_URL + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/')
            .respond(serverResponse);

        orchestrateService.loadHistory(domain, instance, option)
            .success(function(response) {
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it("should load instances", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('GET', API_URL + '/v1/orchestrate/'+ domain +'/'+ instance +'/')
            .respond(serverResponse);

        orchestrateService.loadInstances(domain, instance)
            .success(function(response) {
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it("should load option by id", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('GET', API_URL + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/' + optionId)
            .respond(serverResponse);

        orchestrateService.loadOption(domain, instance, option, optionId)
            .success(function(response) {
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });

    it("should load log url", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('POST', API_URL + activateUrl, data)
            .respond(serverResponse);

        orchestrateService.loadLogUrl(activateUrl, data)
            .success(function(response) {
                expect(response).toEqual(serverResponse);
                done();
            });

        httpBackend.flush();
    });
});