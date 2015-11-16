describe('Factory: authInterceptor ', function() {
    var authInterceptor, auth;

    var token = 'token',
        config = {headers: {}};

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.config'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));

    beforeEach(function() {
        inject(function (_authInterceptor_, _auth_) {
            authInterceptor = _authInterceptor_;
            auth = _auth_;
        });
    });


    describe ('request', function() {
        beforeEach(function() {
            spyOn(auth, 'getToken').and.returnValue(token);
        });
        it ('should add "Bearer token" to the config.headers.Authorization and set config.headers.Accept to "application/json" and return config', function() {
            var result = authInterceptor.request(config);
            expect(result.headers.Authorization).toBe('Bearer ' + token);
            expect(result.headers.Accept).toBe('application/json');
        });
    });

    describe ('response', function() {
        it('should return what it gets', function() {
            expect(authInterceptor.response(config)).toBe(config);
        });
    });
});
