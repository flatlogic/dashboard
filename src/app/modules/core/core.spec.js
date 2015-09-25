describe('Service: dataLoader', function() {

    beforeEach(module('qorDash.core'));

    var dataLoader;
    var httpBackend;

    beforeEach(inject(function($httpBackend, _dataLoader_) {
        httpBackend = $httpBackend;
        dataLoader = _dataLoader_;
    }));

    it('permissions key should match the value', function() {
        expect(dataLoader.permissionsJsonKey).toBe('permissions_json');
    });
});