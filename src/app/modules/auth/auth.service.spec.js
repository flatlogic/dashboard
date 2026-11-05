describe('Factory: auth', function() {
    var auth, window;

    var tokenKey = 'authToken',
        token = 'token.eyJ0b2tlbiI6ICJ0b2tlbiJ9',
        response = {data:{token:token}};

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.config'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));

    beforeEach(function() {
        inject(function (_authInterceptor_, _auth_, _$window_) {
            auth = _auth_;
            window = _$window_;
            window.localStorage.removeItem(tokenKey);
        });
    });

    afterEach(function() {
        window.localStorage.removeItem(tokenKey);
    });

    describe ('saveToken', function() {
        it ('should save argument to the localStorage by tokenKey', function() {
            auth.saveToken(response);
            expect(window.localStorage[tokenKey]).toBe(token);
        });
    });

    describe ('saveToken', function() {
        it ('shouldn\'t save anything if token property is missing', function() {
            auth.saveToken({});
            expect(window.localStorage[tokenKey]).toBe(undefined);
        });
    });

    describe ('saveToken', function() {
        it ('should get token from localStorage by tokenKey', function() {
            auth.saveToken(response);
            expect(auth.getToken()).toBe(token);
        });
    });

    describe ('removeToken', function() {
        it ('should remove token from localStorage by tokenKey', function() {
            auth.saveToken(response);
            auth.removeToken();

            expect(window.localStorage[tokenKey]).not.toBeDefined();
        });
    });

    describe ('getParsedToken', function() {
        it ('should return the local demo payload without a stored token', function() {
            expect(auth.getParsedToken()).toEqual({blah: 3});
        });

        it ('should keep the demo payload when a token is stored', function() {
            auth.saveToken(response);
            expect(auth.getParsedToken()).toEqual({blah: 3});
            expect(auth.getToken()).toBe(token);
        });
    });

});
