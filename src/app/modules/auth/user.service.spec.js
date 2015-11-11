describe('Service: userService ', function() {
    var userService, httpBackend, auth, auth;

    var token = 'token',
        serverResponse = {token: 1},
        username = 'username',
        password = 'password',
        AUTH_API_URL;

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.constants'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));

    beforeEach(function() {
        inject(function ($httpBackend, _user_, _auth_, _AUTH_API_URL_, $state) {
            userService = _user_;
            httpBackend = $httpBackend;
            auth = _auth_;
            AUTH_API_URL = _AUTH_API_URL_;

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

    describe ('login', function() {
        beforeEach(function() {
            spyOn(auth, 'saveToken');
        });
        it ('should send POST request with params and should save token by call to auth.saveToken', function(done) {
            httpBackend.expect('POST', AUTH_API_URL + '/auth', {username: username, password: password}, undefined).respond(serverResponse);

            userService.login(username, password).then(function() {
                expect(auth.saveToken).toHaveBeenCalled();
                done();
            });

            httpBackend.flush();
        });
    });
});
