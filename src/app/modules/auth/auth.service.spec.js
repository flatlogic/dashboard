describe('Factory: auth ', function() {
    var auth, window;

    var tokenKey = 'authToken',
        token = 'token.eyJ0b2tlbiI6ICJ0b2tlbiJ9',
        decodedToken = 'token';


    beforeEach(module('qorDash.auth'));

    beforeEach(function() {
        inject(function (_authInterceptor_, _auth_, _$window_) {
            auth = _auth_;
            window = _$window_;
        });
    });

    describe ('saveToken', function() {
        it ('should save argument to the localStorage by tokenKey', function() {
            auth.saveToken(token);
            expect(window.localStorage[tokenKey]).toBe(token);
        });
        afterEach(function() {
            delete window.localStorage[tokenKey];
        });
    });

    describe ('saveToken', function() {
        it ('should get token from localStorage by tokenKey', function() {
            auth.saveToken(token);
            expect(auth.getToken()).toBe(token);
        });
        afterEach(function() {
            delete window.localStorage[tokenKey];
        });
    });

    describe ('removeToken', function() {
        it ('should remove token from localStorage by tokenKey', function() {
            auth.saveToken(token);
            auth.removeToken();

            expect(window.localStorage[tokenKey]).not.toBeDefined();
        });
    });

    describe ('getParsedToken', function() {
        it ('should get token from localStorage by tokenKey, decode and return', function() {
            auth.saveToken(token);

            expect(auth.getParsedToken().token).toBe(decodedToken);
        });
    });

});