describe('Factory: githubOauth', function() {
    var githubOauth,
    $httpBackend,
    $q,
    $window;

    // Stubbing modules is necessary (for now) because of the way the unit test has been written.
    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth', function($provide){
        // Stubbing constants is necessary (for now) because of the way the application
        // is bootstrapped in index.js.
        $provide.constant('AUTH_API_URL', 'api url');
        $provide.constant('GITHUB_CLIENT_ID', 'github client id');
    }));
    beforeEach(inject(function(_githubOauth_, _$httpBackend_, _$q_, _$window_, $state){
        githubOauth = _githubOauth_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $window = _$window_;

        spyOn($state, 'go').and.returnValue(true);
    }));
    beforeEach(function(){
        spyOn($window, 'open').and.returnValue({});
    });

    describe('init', function() {
        it('defines property GITHUB_AUTH_API_URL', function(){
            expect(githubOauth.GITHUB_AUTH_API_URL).toBeDefined();
        });
        it('defines state', function(){
            expect(githubOauth.state).toBeDefined();
        });
    });
    describe('openPopup', function() {
        it('returns a promise', function(){
            expect(typeof githubOauth.openPopup({}).then).toBe('function');
        });
        it('calls _openPopupWindow', function(){
            spyOn(githubOauth, '_openPopupWindow');
            var options = {};

            githubOauth.openPopup(options);

            expect(githubOauth._openPopupWindow).toHaveBeenCalledWith(options);
        });
        it('defines $window.oAuthCallbackGitHub', function(){
            githubOauth.openPopup({});
            expect(typeof $window.oAuthCallbackGitHub).toBe('function');
        });
    });
    describe('loginWithGitHubIfRedirectedByPopup', function() {
        describe('when _isGitHubPopup returns true', function(){
            beforeEach(function(){
                $window.opener = {};
                $window.opener.oAuthCallbackGitHub = jasmine.createSpy('oAuthCallbackGitHub');
                $window.opener.isGitHubPopupReferer = true;
            });
            afterEach(function(){
                delete $window.opener.isGitHubPopupReferer;
            });
            it('calls $window.opener.oAuthCallbackGitHub', function(){
                githubOauth.loginWithGitHubIfRedirectedByPopup();

                expect($window.opener.oAuthCallbackGitHub).toHaveBeenCalled();
            });
            it('calls _parseCode', function(){
                spyOn(githubOauth, '_parseCode');

                githubOauth.loginWithGitHubIfRedirectedByPopup();

                expect(githubOauth._parseCode).toHaveBeenCalled();
            });
            it('calls _parseState', function(){
                spyOn(githubOauth, '_parseState');

                githubOauth.loginWithGitHubIfRedirectedByPopup();

                expect(githubOauth._parseState).toHaveBeenCalled();
            });
        });
    });
    describe('_generateState', function() {
        it('returns a string', function(){
            expect(typeof githubOauth._generateState()).toBe('string');
        });
    });
    describe('_openPopupWindow', function() {
        it('calls _setReferer', function(){
            spyOn(githubOauth, '_setReferer');

            githubOauth._openPopupWindow({});

            expect(githubOauth._setReferer).toHaveBeenCalled();
        });
        it('calls $window.open', function(){
            githubOauth._openPopupWindow({});
            expect($window.open).toHaveBeenCalled();
        });
    });
    describe('_isGitHubPopup', function() {
        describe('when $window.opener.isGitHubPopupReferer is true', function() {
            it('returns true', function(){
                $window.opener.isGitHubPopupReferer = true;

                expect(githubOauth._isGitHubPopup()).toBe(true);

                delete $window.opener.isGitHubPopupReferer;
            });
        });
        describe('when $window.opener.isGitHubPopupReferer is not set', function() {
            it('returns false', function(){
                expect(githubOauth._isGitHubPopup()).toBe(false);
            });
        });
    });
    describe('_parseCode', function() {
        it('returns the code', function(){
            var code = 'test123456';
            var state = '4321test';
            var url = 'http://example.com?code=' + code + '&state=' + state;

            expect(githubOauth._parseCode(url)).toBe(code);
        });
        it('returns null', function(){
            expect(githubOauth._parseCode('http://example.com')).toBe(null);
        });
    });
    describe('_parseState', function() {
        it('returns the state', function(){
            var code = 'test123456';
            var state = '4321test';
            var url = 'http://example.com?code=' + code + '&state=' + state;

            expect(githubOauth._parseState(url)).toBe(state);
        });
        it('returns null', function(){
            expect(githubOauth._parseState('http://example.com')).toBe(null);
        });
    });
});
