describe('Service: userService ', function() {
    var userService, httpBackend, auth, permissions, $rootScope, $q;

    var username = 'username',
        password = 'password';

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.config'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));

    beforeEach(function() {
        inject(function ($httpBackend, _user_, _auth_, _permissions_, _$rootScope_, _$q_, $state) {
            userService = _user_;
            httpBackend = $httpBackend;
            auth = _auth_;
            permissions = _permissions_;
            $rootScope = _$rootScope_;
            $q = _$q_;

            spyOn($state, 'go').and.returnValue(true);
        });
    });

    afterEach(function() {
        auth.removeToken();
        permissions.clear();
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    describe ('isAuthed', function() {
        it ('should get token from auth.getParsedToken', function() {
            spyOn(auth, 'getParsedToken').and.returnValue(0);
            userService.isAuthed();
            expect(auth.getParsedToken).toHaveBeenCalled();
        });
        describe("if token is expired", function() {
            beforeEach(function() {
                spyOn(auth, 'getParsedToken').and.returnValue({exp: -1});
            });
            it ("should return false", function() {
                expect(userService.isAuthed()).toBe(false);
            });
        });
        describe("if token is empty", function() {
            beforeEach(function() {
                spyOn(auth, 'getParsedToken').and.returnValue(null);
            });
            it ("should return false", function() {
                expect(userService.isAuthed()).toBe(false);
            });
        });
        describe("if token is not expired", function() {
            beforeEach(function() {
                spyOn(auth, 'getParsedToken').and.returnValue({exp: Infinity});
            });
            it ("should return true", function() {
                expect(userService.isAuthed()).toBe(true);
            });
        });
    });

    describe ('login', function() {
        beforeEach(function() {
            spyOn(auth, 'saveToken').and.callThrough();
            spyOn(permissions, 'save').and.callThrough();
        });
        it ('should save the local demo response and resolve without an HTTP request', function() {
            var resolved = false;
            userService.login(username, password).then(function() {
                resolved = true;
            });
            $rootScope.$digest();
            expect(resolved).toBe(true);
            expect(auth.getToken()).toBe('blah');
            expect(auth.saveToken).toHaveBeenCalledWith({data: {token: 'blah'}});
            expect(permissions.save).toHaveBeenCalledWith({data: {token: 'blah'}});
        });
        it ('should propagate token-save failures without saving permissions', function() {
            var failure = new Error('Token storage failed');
            auth.saveToken.and.returnValue($q.reject(failure));
            var rejected = jasmine.createSpy('rejected');
            userService.login(username, password).catch(rejected);
            $rootScope.$digest();
            expect(rejected).toHaveBeenCalledWith(failure);
            expect(permissions.save).not.toHaveBeenCalled();
        });
    });

    describe('logout', function() {
        it ('should remove the stored token and permissions', function() {
            auth.saveToken({data: {token: 'demo-token'}});
            permissions.save({data: {acls: [{resource: 'docker', permissions: ['read']}]}});
            userService.logout();
            expect(auth.getToken()).not.toBeDefined();
            expect(permissions.get()).toBe(null);
        });
    });
});
