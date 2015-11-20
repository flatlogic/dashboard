describe('Service: configurationService', function() {
    var configurationService, httpBackend;

    var serverResponse = 'response',
        domain = 'domain',
        service = 'service',
        instance = 'instance',
        fileName = 'fileName',
        data = 'data',
        version = 'version',
        newVersionName = 'newVersion',
        fileVersion = 'fileVersion',
        API_HOST = 'API_HOST';

    beforeEach(function(){
        module("qorDash.api");
        module(function($provide) {
            $provide.constant("API_HOST", API_HOST);
            $provide.service('errorHandler', function(){
                this.showError = jasmine.createSpy('showError');
            });
        });
    });

    beforeEach(function() {
        inject(function (_configurationService_, $httpBackend) {
            configurationService = _configurationService_;
            httpBackend = $httpBackend;
        });
    });


    it("should load instance by domain id", function(done) {
        httpBackend.expect('GET', API_HOST + '/v1/conf/' + domain + '/').respond(serverResponse);

        configurationService.loadInstance(domain).then(function(response) {
            expect(response).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should load env", function(done) {
        httpBackend.expect('GET', API_HOST + '/v1/env/' + domain + '/').respond(serverResponse);

        configurationService.loadEnv(domain).then(function(response) {
            expect(response).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should create file", function(done) {
        httpBackend.expect('POST', API_HOST + '/v1/conf/' + domain + '/' + service + '/' + fileName, data).respond(serverResponse);

        configurationService.files.createFile(domain, service, fileName, data).then(function(response) {
            expect(response).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should get file content", function(done) {
        httpBackend.expect('GET', API_HOST + '/v1/conf/' + domain + '/' + instance + '/' + service + '/' + version + '/' + fileName).respond(serverResponse);

        configurationService.files.getFileContent(domain, instance, service, version, fileName).then(function(response) {
            expect(response).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should get file versions", function(done) {
        httpBackend.expect('GET', API_HOST + '/v1/conf/' + domain + '/' + instance + '/' + service + '/' + fileName + '/').respond(serverResponse);

        configurationService.files.getVersions(domain, instance, service, fileName).then(function(response) {
            expect(response).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should get base file", function(done) {
        httpBackend.expect('GET', API_HOST + '/v1/conf/' + domain + '/' + service + '/' + fileName).respond(serverResponse);

        configurationService.files.getBaseFile(domain, service, fileName).then(function(response) {
            expect(response).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should create file version", function(done) {
        httpBackend.expect('POST', API_HOST + '/v1/conf/' + domain + '/' + instance + '/' + service + '/' + newVersionName + '/' + fileName,
        undefined, function(headers) { return headers['X-Dash-Version'] == fileVersion; }).respond(serverResponse);

        configurationService.files.createVersion(domain, instance, service, newVersionName, fileName, fileVersion).then(function(response) {
            expect(response).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should save file", function(done) {
        httpBackend.expect('PUT', API_HOST + '/v1/conf/' + domain + '/' + instance + '/' + service + '/'
            + version + '/' + fileName, data, function(headers) { return headers['X-Dash-Version'] == fileVersion; }).respond(serverResponse);

        configurationService.files.saveFile(domain, instance, service, version, fileName, fileVersion, data).then(function(response) {
            expect(response).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should clone file", function(done) {
        httpBackend.expect('POST', API_HOST + '/v1/conf/' + domain + '/' + instance + '/' + service + '/'
            + version + '/' + fileName, data).respond(serverResponse);

        configurationService.files.cloneFile(domain, instance, service, version, fileName, data).then(function(response) {
            expect(response).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should delete file", function(done) {
        httpBackend.expect('DELETE', API_HOST + '/v1/conf/' + domain + '/' + instance + '/' + service + '/'
            + version + '/' + fileName, undefined, function(headers) { return headers['X-Dash-Version'] == fileVersion; }).respond(serverResponse);

        configurationService.files.deleteFile(domain, instance, service, version, fileName, fileVersion).then(function(response) {
            expect(response).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should make file version live", function(done) {
        httpBackend.expect('POST', API_HOST + '/v1/conf/' + domain + '/' + instance + '/' + service + '/'
            + version + '/' + fileName +  '/live').respond(serverResponse);

        configurationService.files.makeVersionLive(domain, instance, service, version, fileName).then(function(response) {
            expect(response).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });
});
