describe('Service: userService ', function() {
    var userService, httpBackend, auth, dataLoader, auth;

    var token = 'token',
        serverResponse = {token: 1},
        username = 'username',
        password = 'password',
        AUTH_API_URL = 'AUTH_API_URL';

    beforeEach(module('qorDash.auth', function($provide) {
        $provide.constant("AUTH_API_URL", AUTH_API_URL);
    }));

    beforeEach(module('qorDash.auth'));

    beforeEach(function() {
        inject(function ($httpBackend, _dataLoader_, _user_, _auth_, $state) {
            userService = _user_;
            dataLoader = _dataLoader_;
            httpBackend = $httpBackend;
            auth = _auth_;

            httpBackend.expectGET('data/permissions.json').respond('');
            spyOn($state, 'go').and.returnValue(true);
        });
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

    describe ('getPermissions', function() {
        it ('should get token from getParsedToken', function() {
            spyOn(auth, 'getParsedToken').and.returnValue(0);
            userService.getPermissions();
            expect(auth.getParsedToken).toHaveBeenCalled();
        });
        describe("if token is empty", function() {
            beforeEach(function() {
                spyOn(auth, 'getParsedToken').and.returnValue(null);
            });
            it ("should return empty array", function() {
                expect(userService.getPermissions()).toEqual([]);
            });
        });
        describe("if token is not empty", function() {
            beforeEach(function() {
                spyOn(auth, 'getParsedToken').and.returnValue({
                    'passport/@scopes': '1,2,3'
                });
            });
            it ("should return array contains splited passport/@scopes string", function() {
                expect(userService.getPermissions()).toEqual(['1','2','3']);
            });
        });
    });

    describe ('login', function() {
        beforeEach(function() {
            spyOn(auth, 'saveToken');
        });
        it ('should send POST request with params and should save token by call to auth.saveToken', function(done) {
            httpBackend.expect('POST', AUTH_API_URL + '/auth', {username: username, password: password}, {"Content-Type":"application/json","Accept":"application/json"}).respond(serverResponse);

            userService.login(username, password).then(function() {
                expect(auth.saveToken).toHaveBeenCalledWith(serverResponse.token);
                done();
            });

            httpBackend.flush();
        });
    });

    describe ('hasAccessTo', function() {
        beforeEach(function() {
            spyOn(userService, 'getPermissions').and.returnValue([1,2,3]);
            spyOn(dataLoader, 'getGlobalPermissions').and.returnValue({5: 1});
        });
        describe ('if user has access', function() {
            it ('should return true', function() {
                expect(userService.hasAccessTo(5)).toBe(true);
            });
        });
        describe ('if user has access', function() {
            it ('should return false', function() {
                expect(userService.hasAccessTo(6)).toBe(false);
            });
        });
    });
});