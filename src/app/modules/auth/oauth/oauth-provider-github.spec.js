describe('Factory: oauthProviderGitHub', function() {
    var oauthProviderGitHub,
    $httpBackend,
    $q,
    $window;
    beforeEach(module('qorDash.auth', function($provide){
        // Stubbing constants is necessary (for now) because of the way the application
        // is bootstrapped in index.js.
        $provide.constant('AUTH_API_URL', 'api url');
        $provide.constant('GITHUB_CLIENT_ID', 'github client id');
    }));
    beforeEach(inject(function(_oauthProviderGitHub_, _$httpBackend_, _$q_, _$window_, $state){
        oauthProviderGitHub = _oauthProviderGitHub_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $window = _$window_;

        spyOn($state, 'go').and.returnValue(true);
        $httpBackend.expectGET('data/permissions.json').respond('');
    }));
    beforeEach(function(){
        spyOn($window, 'open').and.returnValue({});
    });


    describe('init', function() {
        it('defines property GITHUB_AUTH_API_URL', function(){
            expect(oauthProviderGitHub.GITHUB_AUTH_API_URL).toBeDefined();
        });
    });
    describe('login', function() {
        it('returns a promise', function(){
            expect(typeof oauthProviderGitHub.login().then).toBe('function');
        });
        it('calls openPopup', function(){
            spyOn(oauthProviderGitHub, 'openPopup');

            oauthProviderGitHub.login();

            expect(oauthProviderGitHub.openPopup).toHaveBeenCalled();
        });
    });
    describe('exchangeToken', function() {
        it('returns a promise', function(){
            expect(typeof oauthProviderGitHub.exchangeToken(123).then).toBe('function');
        });
    });
    describe('openPopup', function() {
        it('returns a promise', function(){
            expect(typeof oauthProviderGitHub.openPopup({}).then).toBe('function');
        });
        it('calls _openPopupWindow', function(){
            spyOn(oauthProviderGitHub, '_openPopupWindow');
            var options = {};

            oauthProviderGitHub.openPopup(options);

            expect(oauthProviderGitHub._openPopupWindow).toHaveBeenCalledWith(options);
        });
        it('defines $window.oAuthCallbackGitHub', function(){
            oauthProviderGitHub.openPopup({});
            expect(typeof $window.oAuthCallbackGitHub).toBe('function');
        });
    });
    describe('loginWithGitHubIfRedirectedByPopup', function() {
        describe('when _isGitHubPopup returns true', function(){
            it('calls $window.opener.oAuthCallbackGitHub', function(){
                $window.opener = {};
                $window.opener.oAuthCallbackGitHub = jasmine.createSpy('oAuthCallbackGitHub');
                $window.opener.isGitHubPopupReferer = true;

                oauthProviderGitHub.loginWithGitHubIfRedirectedByPopup();

                expect($window.opener.oAuthCallbackGitHub).toHaveBeenCalled();

                delete $window.opener.isGitHubPopupReferer;
            });
        });
    });
    describe('_openPopupWindow', function() {
        it('calls _setReferer', function(){
            spyOn(oauthProviderGitHub, '_setReferer');

            oauthProviderGitHub._openPopupWindow({});

            expect(oauthProviderGitHub._setReferer).toHaveBeenCalled();
        });
        it('calls $window.open', function(){
            oauthProviderGitHub._openPopupWindow({});
            expect($window.open).toHaveBeenCalled();
        });
    });
    describe('_isGitHubPopup', function() {
        describe('when $window.opener.isGitHubPopupReferer is true', function() {
            it('returns true', function(){
                $window.opener.isGitHubPopupReferer = true;

                expect(oauthProviderGitHub._isGitHubPopup()).toBe(true);

                delete $window.opener.isGitHubPopupReferer;
            });
        });
        describe('when $window.opener.isGitHubPopupReferer is not set', function() {
            it('returns false', function(){
                expect(oauthProviderGitHub._isGitHubPopup()).toBe(false);
            });
        });
    });
});
