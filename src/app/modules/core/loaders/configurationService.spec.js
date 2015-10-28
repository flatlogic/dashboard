describe('Service: configurationService', function() {
    var configurationService, httpBackend;

    var serverResponse = 'response',
        domain = 'domain',
        service = 'service',
        instance = 'instance',
        fileName = 'fileName',
        targetInstance = 'targetInstance',
        data = 'data',
        domainId = '1',
        xDashVersion = 'xDash',
        version = 'version',
        newVersionName = 'newVersion',
        fileVersion = 'fileVersion',
        API_URL = 'API_URL';

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module("qorDash.loaders"));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("API_URL", API_URL);
    }));

    beforeEach(function() {
        inject(function (_configurationService_, $httpBackend, _dataLoader_, _user_, $state) {
            configurationService = _configurationService_;
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


    it("should load instance by domain id", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('GET', API_URL + '/v1/conf/' + domain + '/').respond(serverResponse);

        configurationService.loadInstance(domain).then(function(response) {
            expect(response.data).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should load env", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('GET', API_URL + '/v1/env/' + domain + '/').respond(serverResponse);

        configurationService.loadEnv(domain).then(function(response) {
            expect(response.data).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should create file", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('POST', API_URL + '/v1/conf/' + domain + '/' + service + '/' + fileName, data).respond(serverResponse);

        configurationService.files.createFile(domain, service, fileName, data).then(function(response) {
            expect(response.data).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should get file content", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('GET', API_URL + '/v1/conf/' + domain + '/' + instance + '/' + service + '/' + version + '/' + fileName).respond(serverResponse);

        configurationService.files.getFileContent(domain, instance, service, version, fileName).then(function(response) {
            expect(response.data).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should get file versions", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('GET', API_URL + '/v1/conf/' + domain + '/' + instance + '/' + service + '/' + fileName + '/').respond(serverResponse);

        configurationService.files.getVersions(domain, instance, service, fileName).then(function(response) {
            expect(response.data).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should get base file", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('GET', API_URL + '/v1/conf/' + domain + '/' + service + '/' + fileName).respond(serverResponse);

        configurationService.files.getBaseFile(domain, service, fileName).then(function(response) {
            expect(response.data).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should create file version", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('POST', API_URL + '/v1/conf/' + domain + '/' + instance + '/' + service + '/' + newVersionName + '/' + fileName,
        undefined, function(headers) { return headers['X-Dash-Version'] == fileVersion; }).respond(serverResponse);

        configurationService.files.createVersion(domain, instance, service, newVersionName, fileName, fileVersion).then(function(response) {
            expect(response.data).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should save file", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('PUT', API_URL + '/v1/conf/' + domain + '/' + instance + '/' + service + '/'
            + version + '/' + fileName, data, function(headers) { return headers['X-Dash-Version'] == fileVersion; }).respond(serverResponse);

        configurationService.files.saveFile(domain, instance, service, version, fileName, fileVersion, data).then(function(response) {
            expect(response.data).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should clone file", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('POST', API_URL + '/v1/conf/' + domain + '/' + instance + '/' + service + '/'
            + version + '/' + fileName, data).respond(serverResponse);

        configurationService.files.cloneFile(domain, instance, service, version, fileName, data).then(function(response) {
            expect(response.data).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should delete file", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('DELETE', API_URL + '/v1/conf/' + domain + '/' + instance + '/' + service + '/'
            + version + '/' + fileName, undefined, function(headers) { return headers['X-Dash-Version'] == fileVersion; }).respond(serverResponse);

        configurationService.files.deleteFile(domain, instance, service, version, fileName, fileVersion).then(function(response) {
            expect(response.data).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    it("should make file version live", function(done) {
        httpBackend.expectGET('data/permissions.json').respond('');
        httpBackend.expect('POST', API_URL + '/v1/conf/' + domain + '/' + instance + '/' + service + '/'
            + version + '/' + fileName +  '/live').respond(serverResponse);

        configurationService.files.makeVersionLive(domain, instance, service, version, fileName).then(function(response) {
            expect(response.data).toEqual(serverResponse);
            done();
        });

        httpBackend.flush();
    });

    describe('env', function() {
        it("should create new version", function(done) {
            httpBackend.expectGET('data/permissions.json').respond('');
            httpBackend.expect('POST', API_URL + '/v1/env/' + domain + '/' + instance + '/' + service + '/' + newVersionName).respond(serverResponse);

            configurationService.env.createVersion(domain, instance, service, newVersionName).then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

            httpBackend.flush();
        });

        it("should load variables", function(done) {
            httpBackend.expectGET('data/permissions.json').respond('');
            httpBackend.expect('GET', API_URL + '/v1/env/' + domain + '/' + instance + '/' + service + '/' + version).respond(serverResponse);

            configurationService.env.loadVariables(domain, instance, service, version).then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

            httpBackend.flush();
        });

        it("should load versions", function(done) {
            httpBackend.expectGET('data/permissions.json').respond('');
            httpBackend.expect('GET', API_URL + '/v1/env/' + domain + '/' + instance + '/' + service + '/').respond(serverResponse);

            configurationService.env.loadVersions(domain, instance, service).then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

            httpBackend.flush();
        });

        it("should make version live", function(done) {
            httpBackend.expectGET('data/permissions.json').respond('');
            httpBackend.expect('POST', API_URL + '/v1/env/' + domain + '/' + instance + '/' + service + '/' + version + '/live').respond(serverResponse);

            configurationService.env.makeVersionLive(domain, instance, service, version).then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

            httpBackend.flush();
        });

        it("should save to new target", function(done) {
            httpBackend.expectGET('data/permissions.json').respond('');
            httpBackend.expect('POST', API_URL + '/v1/env/' + domain + '/' + targetInstance + '/' + service + '/' + newVersionName, data).respond(serverResponse);

            configurationService.env.saveToNewTarget(domain, targetInstance, service, newVersionName, data).then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

            httpBackend.flush();
        });

        it("should save changes", function(done) {
            httpBackend.expectGET('data/permissions.json').respond('');
            httpBackend.expect('PATCH', API_URL + '/v1/env/' + domainId + '/' + instance + '/' + service + '/' + version, data, function(headers) {return headers['X-Dash-Version'] == xDashVersion} ).respond(serverResponse);

            configurationService.env.save(domainId, instance, service, version, xDashVersion, data).then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

            httpBackend.flush();
        });
    });

    describe('packages', function() {
        it("should load pkg", function(done) {
            httpBackend.expectGET('data/permissions.json').respond('');
            httpBackend.expect('GET', API_URL + '/v1/pkg/' + domain + '/').respond(serverResponse);

            configurationService.loadPkg(domain).then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

            httpBackend.flush();
        });

        it("should load variables", function(done) {
            httpBackend.expectGET('data/permissions.json').respond('');
            httpBackend.expect('GET', API_URL + '/v1/pkg/' + domain + '/' + instance + '/' + service + '/' + version).respond(serverResponse);

            configurationService.pkg.loadVariables(domain, instance, service, version).then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

            httpBackend.flush();
        });

        it("should load versions", function(done) {
            httpBackend.expectGET('data/permissions.json').respond('');
            httpBackend.expect('GET', API_URL + '/v1/pkg/' + domain + '/' + instance + '/' + service + '/').respond(serverResponse);

            configurationService.pkg.loadVersions(domain, instance, service).then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

            httpBackend.flush();
        });

        it("should make version live", function(done) {
            httpBackend.expectGET('data/permissions.json').respond('');
            httpBackend.expect('POST', API_URL + '/v1/pkg/' + domain + '/' + instance + '/' + service + '/' + version + '/live').respond(serverResponse);

            configurationService.pkg.makeLive(domain, instance, service, version).then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

            httpBackend.flush();
        });

        it("should save to new target", function(done) {
            httpBackend.expectGET('data/permissions.json').respond('');
            httpBackend.expect('POST', API_URL + '/v1/pkg/' + domain + '/' + targetInstance + '/' + service + '/' + newVersionName, data).respond(serverResponse);

            configurationService.pkg.saveToNewTarget(domain, targetInstance, service, newVersionName, data).then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

            httpBackend.flush();
        });

        it("should save changes", function(done) {
            httpBackend.expectGET('data/permissions.json').respond('');
            httpBackend.expect('PUT', API_URL + '/v1/pkg/' + domainId + '/' + instance + '/' + service + '/' + version, data).respond(serverResponse);

            configurationService.pkg.save(domainId, instance, service, version, data).then(function(response) {
                expect(response.data).toEqual(serverResponse);
                done();
            });

            httpBackend.flush();
        });
    });
});
