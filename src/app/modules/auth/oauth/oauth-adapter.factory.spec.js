describe('Factory: oauth adapter', function() {
    var $timeout,
        $q,
        oauthAdapter,
        auth,
        errorHandler,
        oauthProviderGoogle,
        oauthProviderGitHub;

    var oauthProviderGoogleMock = {
        login: jasmine.createSpy('login'),
        logout: jasmine.createSpy('logout')
    };

    beforeEach(function(){
        module('qorDash.auth.oauth');
        module(function($provide){
            $provide.service('auth', function(){
                this.saveToken = jasmine.createSpy('saveToken');
            });
            $provide.service('errorHandler', function(){
                this.showError = jasmine.createSpy('showError');
            });
            $provide.factory('oauthProviderGoogle', function(){
                return oauthProviderGoogleMock;
            });
            $provide.factory('oauthProviderGitHub', function(){
                return {};
            });
        });
    });

    beforeEach(function() {
        inject(function(_oauthAdapter_, _$timeout_, _$q_, _auth_, _errorHandler_, _oauthProviderGoogle_, _oauthProviderGitHub_) {
            auth = _auth_;
            oauthAdapter = _oauthAdapter_;
            $timeout = _$timeout_;
            $q = _$q_;
            errorHandler = _errorHandler_;
            oauthProviderGoogle = _oauthProviderGoogle_;
            oauthProviderGitHub = _oauthProviderGitHub_;
            oauthProviderGoogle.exchangeToken = jasmine.createSpy('exchangeToken').and.callFake(function(){
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });
        });
    });

    describe('init', function() {
        it ('should return a promise with selected provider', function() {
            oauthAdapter.init(oauthProviderGoogleMock).then(function(response){
                expect(response).toEqual(oauthProviderGoogleMock);
            });
            $timeout.flush();
        });
    });
    describe('provider methods', function(){
        describe('login', function() {
            it ('should call login function of selected provider', function() {
                oauthAdapter.init(oauthProviderGoogleMock).then(oauthAdapter.login);
                $timeout.flush();
                expect(oauthProviderGoogleMock.login).toHaveBeenCalled();
            });
        });
        describe('logout', function() {
            it ('should call logout function of selected provider', function() {
                oauthAdapter.init(oauthProviderGoogleMock).then(oauthAdapter.logout);
                $timeout.flush();
                expect(oauthProviderGoogleMock.logout).toHaveBeenCalled();
            });
        });
        describe('exchangeToken', function() {
            it ('should call exchangeToken function of selected provider and resolve the promise', function() {
                oauthAdapter.init(oauthProviderGoogleMock).then(oauthAdapter.exchangeToken);
                $timeout.flush();
                expect(oauthProviderGoogleMock.exchangeToken).toHaveBeenCalled();
                expect(auth.saveToken).toHaveBeenCalled();
            });
            it ('should call exchangeToken function of selected provider and reject the promise', function() {
                oauthProviderGoogle.exchangeToken = jasmine.createSpy('exchangeToken').and.callFake(function(){
                    return $q.reject('error');
                });
                oauthAdapter.init(oauthProviderGoogleMock).then(oauthAdapter.exchangeToken);
                $timeout.flush();
                expect(errorHandler.showError).toHaveBeenCalledWith('error');
            });
        });
    })

});
